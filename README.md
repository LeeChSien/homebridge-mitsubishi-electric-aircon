# homebridge-mitsubishi-electric-aircon

Homebridge plugin for Mitsubishi Electric air conditioners.

Control the air conditioner in local area network.

<img src="https://github.com/user-attachments/assets/efa7548c-0be3-4006-964e-521fb9d50989" width="300" />

<img src="https://github.com/user-attachments/assets/5c194a0f-d56f-41f5-ade1-52cce0f3f47c" width="300" />

## Usage

```js
"platforms": [
  {
    "platform": "MitsubishiElectricAircon",
    "aircons": [
      {
        "name": "My Aircon", // optional, for display
        "ip": "192.168.11.22",
        "model": "MSZ-ZW5620S-W", // optional, for display
        "disableAuto": false // optional, to disable auto mode
      }
    ]
  }
]
```

### Build Plugin

TypeScript needs to be compiled into JavaScript before it can run. The following command will compile the contents of your [`src`](./src) directory and put the resulting code into the `dist` folder.

```shell
npm run build
```

### Link To Homebridge

Run this command so your global installation of Homebridge can discover the plugin in your development environment:

```shell
npm link
```

You can now start Homebridge, use the `-D` flag, so you can see debug log messages in your plugin:

```shell
homebridge -D
```
