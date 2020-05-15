# mystack

Interface developed to work with OpenStack's API.
Before running the project:
  1. Need access to an OpenStack Server (to access the API);
  2. Check URL used to make the requests (axios) -> Make the changes to match yours;
  3. This project has a component designed to work with Heat Resources. For that component to work properly, the OpenStack Service should have that additional service configured. (Heat can be configured using devstack).


## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
