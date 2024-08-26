# homebridge-mitsubishi-electric-aircon

Homebridge plugin for Mitsubishi Electric air conditioners.

Control the air conditioner in local area network.


## Usage

```js
"platforms": [
  {
    "platform": "MitsubishiElectricAircon",
    "aircons": [
      {
        "name": "My Aircon", // optional, for display
        "ip": "192.168.11.22",
        "model": "MSZ-ZW5620S-W" // optional, for display
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