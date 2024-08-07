# Get info Cargo.toml file

[![GitHub
release](https://img.shields.io/github/release/rabbitson87/get-cargo-package-info.svg?style=flat-square)](https://github.com/rabbitson87/get-cargo-package-info/releases/latest)
[![GitHub
marketplace](https://img.shields.io/badge/marketplace-get--cargo--package--info-blue?logo=github&style=flat-square)](https://github.com/marketplace/actions/get-info-cargo-toml-file)
[![Licence](https://img.shields.io/github/license/rabbitson87/get-cargo-package-info)](https://github.com/rabbitson87/get-cargo-package-info/blob/main/LICENSE)

## About

A GitHub Action to get info in a Cargo.toml file. This is useful 
for getting project versions when working on docker images.
The returned value is available in the github action step.

## Usage

In the following example, you can learn how to use it, especially 
you can put the desired key value in the package value, and 
you can also enter it in an array. Here is an example of it in use:

```yml
name: Get info Cargo.toml file 

on: [ push ]

jobs:

  get-cargo-package-info:
 
    runs-on: ubuntu-latest
 
    steps:
    - name: Get package info
      id: info
      uses: rabbitson87/get-cargo-package-info@v1
      with:
        file_name: Cargo.toml
        directory: <directory_name>
        package: |
          name
          version
          edition
```

## Inputs

In the example above, there are several key/value pairs that will be added to
output object's values.

| Name                                  | Description                                                                                                                                                              |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `package`                   | These key values are used to obtain values that match the key value of the environment variable corresponding to `[package]` from the 'Cargo.toml' file                                                           |
| `directory` (**Optional**)            | This key will set the directory in which you want to get info in `Cargo.toml` file. **Important: cannot start with `/`. Action will fail if the specified directory doesn't exist.** |
| `file_name` (**Optional**)            | Set the name of the 'Cargo.toml' file. Defaults to `Cargo.toml`                                                                                                               |

## Output

The output value is output in json form according to the value set in the package. 
The following example shows the expected json form:

```json
{
  "name": "test_toml",
  "version": "0.1.0",
  "edition": "2021"
}
```

### Input Cargo.toml

```toml
[package]
name = "test_toml"
version = "0.1.0"
edition = "2021"
```

### Output usage

```yml
name: Get info Cargo.toml file 

on: [ push ]

jobs:

  get-cargo-package-info:
 
    runs-on: ubuntu-latest
 
    steps:
    - name: Get package info
      id: info
      uses: rabbitson87/get-cargo-package-info@v1
      with:
        package: |
          version

    - name: Use output
      shell: bash
      run: echo "version is ${{ steps.info.outputs.object.package.version }}"
```

## Potential Issues

### Warnings
