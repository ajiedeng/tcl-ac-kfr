<script>
require("../assets/js/gomesmart.js");
// require("../assets/js/gomesmart.2.2.min.js");
// require("../assets/js/dragGuage.js");
var device = new GS.Device();


var deviceData = {
  "0": 1,       // 开关机  0:待机;1:开机
  "2004" : 1,  // 亮度
  "2005": 0  // 色温
};


export default {
  device,
  deviceData
};
</script>