import * as core from '@actions/core'
import * as path from 'path'
import * as fs from 'fs/promises'
import {Util} from '@docker/actions-toolkit/lib/util'

async function run(): Promise<void> {
  try {
    const packages = Util.getInputList('package', {
      ignoreComma: true,
      comment: '#'
    })

    const directory = core.getInput('directory') || ''
    const fileName = core.getInput('file_name') || 'Cargo.toml'
    let filePath = process.env['GITHUB_WORKSPACE'] || '.'

    if (filePath === '' || filePath === 'None') {
      filePath = '.'
    }

    if (directory === '') {
      filePath = path.join(filePath, fileName)
    } else if (directory.startsWith('/')) {
      throw new Error(
        'Absolute paths are not allowed. Please use a relative path.'
      )
    } else if (directory.startsWith('./')) {
      filePath = path.join(filePath, directory.slice(2), fileName)
    } else {
      filePath = path.join(filePath, directory, fileName)
    }

    const cargoToml = await fs.readFile(filePath, 'utf8')

    const filter = new RegExp(/\s|"/g)
    let category = ''
    const objectDatas: {[key: string]: {[key: string]: string}} = {}
    cargoToml.split('\n').forEach(line => {
      const trimedLine = line.trim()
      if (trimedLine !== '') {
        if (trimedLine.startsWith('[')) {
          category = trimedLine.slice(1, -1)
        } else if (!trimedLine.startsWith('#')) {
          let [key, value] = trimedLine.replace(filter, '').split('=')
          if (objectDatas[category] === undefined) {
            objectDatas[category] = {}
          }
          objectDatas[category] = {
            ...objectDatas[category],
            [key]: value
          }
        }
      }
    })

    const object: any = {}
    packages.forEach(key => {
      if (objectDatas.package?.[key] === undefined) {
        throw new Error(`package.${key} not found in ${filePath}`)
      } else {
        if (object.package === undefined) {
          object.package = {}
        }
        object.package = {
          ...object.package,
          [key]: objectDatas.package[key]
        }
      }
    })

    core.info(JSON.stringify(object, undefined, 2))
    core.setOutput('object', JSON.stringify(object, undefined, 2))
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

void run()
