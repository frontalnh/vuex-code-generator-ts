# Node DDD Component Generator

본 프로젝트는 Vuex store 를 자동으로 생성해 주는 cli application 입니다.

특정 도메인 명에 대한 rest api서버에 기본적인 crud 요청을 전달하고 state를 변경하는 store 를 생성해 줍니다.

## Getting started

아래 명령어를 통해 환경변수를 설정하여 `vuexgen` 명령어를 사용할 수 있게 합니다.

```sh
export PATH=/Users/namhoonlee/Desktop/git/vuex-code-generator-ts/bin:$PATH
```

전역으로 해당 명령어를 사용하고 싶다면 `/.bash_profile` 에서 위 내용을 환경변수에 추가해 주어야 합니다.

## Command

`vuexgen generate <component>`
명령어를 통해 파일을 생성합니다.
현재는 component 로 store 만 생성 가능합니다.

위 명령어에 도메인 명을 제공하기 위해 -n 옵션을 다음과 같이 사용합니다.

`-n <domain-name>`

example

```sh
vuexgen generate store -n user
vuexgen generate store -n transaction
```

## Configuration

기본으로 생성되는 파일의 경로는 `./store` 입니다.
이를 변경하기 위해서는 `./bin/vuexgen` 파일의 storePath 변수를 수정하면 됩니다.
