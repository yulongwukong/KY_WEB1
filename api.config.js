
var ENV = process.ENV  //设置环境;
var VERSION="1.0.0";

let KY_IP,KY_H5_IP,TEST_ID= "";

/*配置相关的后端接口ip;*/
switch (ENV){
    case "pro": KY_IP = "";
    break;
	case "test": KY_IP = "";
	break;
}

switch (ENV){
	case "pro": KY_H5_IP = "";
	break;
	case "test": KY_H5_IP = "";
	break;
}


console.log({"当前环境:":ENV,"后端接口:":KY_IP,"H5目录地址:":KY_H5_IP,"测试id:":TEST_ID})

module.exports = {
	ENV:ENV,
	KY_IP:KY_IP,
	KY_H5_IP:KY_H5_IP,
	TEST_ID:TEST_ID
};


