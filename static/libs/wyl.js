import md5 from "md5";
import api from "../../api.config.js";

export const jsonToArray = function(json){
    var arr = []
    for(let i in json){

        var toString = '{"'+i+'":"'+ json[i]+'"}';
        var toJson = JSON.parse(toString);
        arr.push(toJson);
    }
    return arr;
}

//控制页面拖动；
export const useDrag = function(str) {
    if (str == "add") {
        $(document).bind("touchmove", function(e) {
            e.preventDefault();
        })
    } else if (str == "cancel") {
        $(document).unbind("touchmove");
    }
}

//测试埋点
export const MyTdApp = function(pageName, subName) {
    try{
        if(isClient()=="android"){
            console.log("安卓："+pageName+"|"+subName);
            TalkingData.onEventWithLabel(pageName,subName);
        }
        else{
            console.log("IOS："+pageName+"|"+subName);
            window.webkit.messageHandlers.TalkingdataIOS.postMessage(pageName+"|"+subName);

        }
    }catch(e){
        console.log(e);
    }
}

//测试埋点

//ios交互低版本兼容；
export const loadURL = function(url) {
    var iFrame;
    iFrame = document.createElement("iframe");
    iFrame.setAttribute("src", url);
    iFrame.setAttribute("style", "display:none;");
    iFrame.setAttribute("height", "0px");
    iFrame.setAttribute("width", "0px");
    iFrame.setAttribute("frameborder", "0");
    document.body.appendChild(iFrame);
    iFrame.parentNode.removeChild(iFrame);
    iFrame = null;
}

export const useMd5 = function(array) {

    var signKey = '86eb1493-6ee8-411d-b377-676acd5c3dd5';

    var resultString = "";

    if (array.length > 0) {

        var parmas = [];
        var resultArray = [];

        for (let i = 0; i < array.length; i++) {
            for (let key in array[i]) {
                parmas.push(key);
            }
        }

        for (let i = 0; i < parmas.sort(function(a, b) {
                if (a.toString().toLowerCase() > b.toString().toLowerCase()) {
                    return 1;
                } else {
                    return -1;
                }
            }).length; i++) {
            for (let j = 0; j < array.length; j++) {
                for (let key in array[j]) {
                    if (parmas[i] == key) {
                        resultArray.push(array[j]);
                    }
                }
            }
        }

        resultArray.map(function(el, index) {
            for (let key in el) {
                resultString += (key + "=" + el[key]);
            }
        });

        //console.log(resultString)

    }

    return md5(resultString + signKey);
}

export const loading = function(state) {
    if (state == "show") {
        $(document).bind("touchmove", function(e) {
            e.preventDefault();
        });

        $(".loadingBg").remove();
        $("body").append("<div class='loadingBg'><div class='loading'>请稍后</div></div>");
    } else if (state == "hide") {
        $(".loadingBg").remove();
        $(document).unbind("touchmove");
    }
}

export const alertBox = function(content, callback) {
    let timer = null;
    // let content = {
    //     content:"",
    //     buttonText:"确定"
    // };
    $(".mask").remove();
    $("body").append("<div class='mask'></div>");

    let boxText =
        `<div class='alertBox'>
        <div class='alertBox_con'>
            <p></p>
        </div>
        <div class='alertBox_btn'></div>
    </div>`

    timer = setTimeout(() => {
        $(".mask").addClass("mask_show");
        $("body").append(boxText);
    }, 0);
}

export const isClient = function() {
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端;

    if (isAndroid) {
        return "android";
    } else if (isiOS) {
        return "ios";
    }
};

export const getCity = function(obj, code) {

    var provinceCode = code.substr(0, 2);
    var cityCode = code.substr(0, 4);
    var provinceText = '';
    var cityText = '';
    var districtText = '';

    //console.log( cityCode  )

    //查询省
    $.ajax({
        url: api.domainIp + "/dataservice/getAllProvinceByJson",
        dataType: "jsonp",
        timeout: 30000,
        jsonp: "callback",
        beforeSend: function() {
            loading("show");
        },
        complete: function(xhr, status) {
            if (status == "timeout") {
                tips({
                    content: "请求超时，请稍后重试！"
                });
                loading("hide");
            }
        },
        success: function(data) {
            data.map(function(el) {
                if (el.code == provinceCode) {
                    provinceText = el.name;
                }
            });
            $(obj).html(provinceText + " " + cityText + " " + districtText);
            loading("hide");
        },
        error: function() {
            tips({
                content: "地区获取失败"
            });
            loading("hide");
        }
    });

    //查询市
    $.ajax({
        url: api.domainIp + "/dataservice/getCityByJson/" + provinceCode,
        dataType: "jsonp",
        timeout: 30000,
        jsonp: "callback",
        beforeSend: function() {
            loading("show");
        },
        complete: function(xhr, status) {
            if (status == "timeout") {
                tips({
                    content: "请求超时，请稍后重试！"
                });
                loading("hide");
            }
        },
        success: function(data) {
            data.map(function(el) {
                if (el.code == cityCode) {
                    cityText = el.name;
                }
            });
            $(obj).html(provinceText + " " + cityText + " " + districtText);
            loading("hide");
        },
        error: function() {
            tips({
                content: "地区获取失败"
            });
            loading("hide");
        }
    });

    if (code.length <= 4) {
        return;
    }

    //查询区
    $.ajax({
        url: api.domainIp + "/dataservice/getDistrictByJson/" + cityCode,
        dataType: "jsonp",
        timeout: 30000,
        jsonp: "callback",
        beforeSend: function() {
            loading("show");
        },
        complete: function(xhr, status) {
            if (status == "timeout") {
                tips({
                    content: "请求超时，请稍后重试！"
                });
                loading("hide");
            }
        },
        success: function(data) {
            console.log(data)
            data.map(function(el) {
                if (el.code == code) {
                    districtText = el.name;
                }
            });
            $(obj).html(provinceText + " " + cityText + " " + districtText);
            loading("hide");
        },
        error: function() {
            tips({
                content: "地区获取失败"
            });
            loading("hide");
        }
    });


};

export const getUrlParam = function(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substring(1).match(reg); //匹配目标参数
    if (r !== null) return decodeURI(r[2]);
    return ''; //返回参数值
};

export const checkHeight = function() { //检测页面的高度
    var bh = $("body").height();
    var wh = $(window).height();

    if (bh < wh) {
        $("body").css({
            "height": wh
        });
    } else {
        $("body").css({
            "height": ""
        });
    }

    $(window).resize(function(event) {
        checkHeight();
    });
};

//封装ajax；
export const useAjax = function(options, callback, errorCall) {

    var defaults = {
        url: '',
        type: 'POST',
        overtime: "30000",
        dataType: 'json',
        contentType: "application/json",
        data: {}
    };

    options = $.extend({}, defaults, options);

    jQuery.ajax({
        url: options.url,
        type: options.type,
        timeout: options.overtime,
        dataType: options.dataType,
        data: options.data,
        beforeSend: function() {
            loading("show");
        },
        complete: function(xhr, textStatus) {
            if (textStatus == 'timeout') {
                tips({
                    content: "请求超时，请稍后重试！"
                });
                loading("hide");
            }
        },
        success: (data) => {

            loading("hide");
            console.log(data);

            if (!data) return;

            if (data.errorcode == "1") {
                if (typeof callback == "function") {
                    callback(data);
                }
            } else {
                tips({
                    content: data.errormsg
                });
                if (typeof errorCall == "function") {
                    errorCall(data);
                }
            }

        },
        error: function() {
            loading("hide");
            tips({
                content: "服务器请求失败，请稍后重试！"
            });
        }
    });
};

export const setCookie = function(name, value, Days) {
    if (Days === null || Days === '') {
        Days = 30;
    }
    var exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + "; path=/;expires=" + exp.toGMTString();
}

export const getCookie = function(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) {
        return unescape(arr[2]);
    } else {
        return null;
    }
};

export const clearCookie = function(name) {
    setCookie(name, '', -1);
};

export const tips = function(options) {
    var defaults = {
        "content": '请输入内容',
        'duration': 2500,
        'type': 'error'
    };

    options = $.extend(true, defaults, options);

    var timer = null;
    $('.weui_toptips').remove();
    var tips = $(".tips").remove();
    tips = $('<div class="tips tips_' + options.type + '">' + options.content + '</div>').appendTo(document.body);
    tips.stop(true, true).animate({
        'top': 0
    }, 300);

    clearTimeout(timer);
    timer = setTimeout(function() {
        tips.stop(true, true).animate({
            'top': '-0.933333rem'
        }, 300, function() {
            tips.remove();
        });
    }, options.duration);

}


export const cityPicker = function(parentId, showEl) {

    $("body").css({
        height: $(window).height(),
        overflow: "hidden"
    });

    $(parentId + " .cityMask").fadeIn("soon");
    $(parentId + " .cityPicker_wrap").fadeIn("soon");

    $(parentId + " .cityMask").click(function() {
        $(this).fadeOut("soon");
        $(parentId + " .cityPicker_wrap").fadeOut("soon");
        $("body").css({
            height: "",
            overflow: ""
        });
    });

    $(parentId + " .cityPicker_content").find("a").click(function() {
        $(".cityMask").click();
        $("body").css({
            height: "",
            overflow: ""
        });
    });

    var ctiyList = $(parentId + " .body");
    var scroll = $(parentId + " .body .scroll");
    var ctiyList_wrap = $(parentId + " .body .scroll .wrap");
    var ctiyList_ul = ctiyList_wrap.find("ul");
    var navBar = $(parentId + " .cityPicker_wrap .navBar span");

    var provinceHtml = "";
    var cityHtml = "";
    // var districtHtml = "";

    scroll.css({
        width: ctiyList.width() * ctiyList_ul.length
    });

    ctiyList_wrap.css({
        width: ctiyList.width()
    });

    $(".scroll").css({
        "left": 0
    });

    navBar.click(function() {
        var index = $(this).index();
        $(this).addClass("active").siblings("span").removeClass("active");
        $(".scroll").stop(true, true).animate({ "left": -1 * index * ctiyList.width() }, 300);
    });

    if (parentId == "#cityPicker") {
        $.ajax({
            url: api.domainIp + "/dataservice/getAllProvinceByJson",
            dataType: "jsonp",
            jsonp: "callback",
            timeout: 30000,
            beforeSend: function() {
                loading("show");
            },
            success: function(data) {
                provinceHtml = "";
                data.forEach(function(el, index) {
                    provinceHtml += "<li code=" + el.code + ">" + el.name + "</li>";
                });
                ctiyList_ul.eq(0).html(provinceHtml);
                loading("hide");
            },
            complete: function(xhr) {　　　　
                if (xhr.responseText == 'timeout') {　　　　　
                    tips({
                        content: "请求超时，请重试"
                    });　　　　
                }
                loading("hide");　　
            },
            error: function() {
                loading("hide");
            }
        });
    }

    if (parentId == "#merchantType_wrap") {
        $.ajax({
            url: api.domainIp + "/dictionary/queryDictionaryByTypeId",
            dataType: "json",
            data: {
                "dictTypeId": "favorTypeA",
                sign: useMd5([
                    { "dictTypeId": "favorTypeA" }
                ])
            },
            beforeSend: function() {
                loading("show");
            },
            success: function(data) {
                provinceHtml = "";
                //console.log(data)
                data.data.forEach(function(el, index) {
                    provinceHtml += "<li id=" + el.dictId + ">" + el.dictName + "</li>";
                });
                ctiyList_ul.eq(0).html(provinceHtml);
                loading("hide");
            },
            error: function() {
                loading("hide");
            }
        });
    }

    ctiyList_ul.eq(0).undelegate("click");
    ctiyList_ul.eq(0).delegate("li", "click", function() {

        var _this = $(this);
        var code = _this.attr("code");
        var id = _this.attr("id");

        if (_this.html() != navBar.eq(0).html()) {
            navBar.eq(0).nextAll("span").html("请选择");
        }

        $(".scroll").stop(true, true).animate({ "left": -1 * 1 * ctiyList.width() }, 300, function() {

            _this.addClass("active").siblings().removeClass("active");
            navBar.eq(0).html(_this.html()).removeClass("active");
            navBar.eq(1).addClass("active");

            if (parentId == "#cityPicker") {
                $.ajax({
                    url: api.domainIp + "/dataservice/getCityByJson/" + code,
                    dataType: "jsonp",
                    jsonp: "callback",
                    timeout: 30000,
                    beforeSend: function() {
                        loading("show");
                    },
                    success: function(data) {
                        cityHtml = "";
                        data.forEach(function(el, index) {
                            cityHtml += "<li code=" + el.code + ">" + el.name + "</li>";
                        });
                        ctiyList_ul.eq(1).html(cityHtml);
                        loading("hide");
                    },
                    complete: function(xhr) {　　　　
                        if (xhr.responseText == 'timeout') {　　　　　
                            tips({
                                content: "请求超时，请重试"
                            });　　　　
                        }
                        loading("hide");　　
                    },
                    serror: function() {
                        loading("hide");
                    }
                });
            }

            if (parentId == "#merchantType_wrap") {

                $.ajax({
                    url: api.domainIp + "dictionary/queryDictionaryByTypeId",
                    dataType: "json",
                    data: {
                        "dictTypeId": id,
                        sign: useMd5([
                            { "dictTypeId": id }
                        ])
                    },
                    beforeSend: function() {
                        loading("show");
                    },
                    success: function(data) {
                        cityHtml = "";
                        data.data.forEach(function(el, index) {
                            cityHtml += "<li dictTypeId=" + el.dictTypeId + "  dictId=" + el.dictId + ">" + el.dictName + "</li>";
                        });
                        ctiyList_ul.eq(1).html(cityHtml);
                        loading("hide");
                    },
                    error: function() {
                        loading("hide");
                    }
                });
            }
        });
    });

    ctiyList_ul.eq(1).undelegate("click");
    ctiyList_ul.eq(1).delegate("li", "click", function() {

        var _this = $(this);
        var code = _this.attr("code");
        var dictId = _this.attr("dictId");
        var dictTypeId = _this.attr("dictTypeId");
        $(showEl).attr({
            "code": code,
            "dictId": dictId,
            "dictTypeId": dictTypeId
        }).html(navBar.eq(0).html() + " " + $(this).html());

        _this.addClass("active").siblings().removeClass("active");
        navBar.eq(1).html($(this).html());
        $(".cityMask").click();

        $("body").css({
            height: "",
            overflow: ""
        });

    });

};

export const addressPicker = function(parentId, showEl) {
    $("body").css({
        height: $(window).height(),
        overflow: "hidden"
    });

    $(parentId + " .cityMask").fadeIn("soon");
    $(parentId + " .cityPicker_wrap").fadeIn("soon");

    $(parentId + " .cityMask").click(function() {
        $(this).fadeOut("soon");
        $(parentId + " .cityPicker_wrap").fadeOut("soon");
        $("body").css({
            height: "",
            overflow: ""
        });
    });

    $(parentId + " .cityPicker_content").find("a").click(function() {
        $(".cityMask").click();
        $("body").css({
            height: "",
            overflow: ""
        });
    });

    var ctiyList = $(parentId + " .body");
    var scroll = $(parentId + " .body .scroll");
    var ctiyList_wrap = $(parentId + " .body .scroll .wrap");
    var ctiyList_ul = ctiyList_wrap.find("ul");
    var navBar = $(parentId + " .cityPicker_wrap .navBar span");

    var provinceHtml = "";
    var cityHtml = "";
    // var districtHtml = "";

    scroll.css({
        width: ctiyList.width() * ctiyList_ul.length
    });

    ctiyList_wrap.css({
        width: ctiyList.width()
    });

    $(".scroll").css({
        "left": 0
    });

    navBar.click(function() {
        var index = $(this).index();
        $(this).addClass("active").siblings("span").removeClass("active");
        $(".scroll").stop(true, true).animate({ "left": -1 * index * ctiyList.width() }, 300);
    });

    if (parentId == "#addressPicker") {
        $.ajax({
            url: api.domainIp + "/dataservice/getAllProvinceByJson",
            dataType: "jsonp",
            jsonp: "callback",
            timeout: 30000,
            beforeSend: function() {
                loading("show");
            },
            success: function(data) {
                provinceHtml = "";
                data.forEach(function(el, index) {
                    provinceHtml += "<li code=" + el.code + ">" + el.name + "</li>";
                });
                ctiyList_ul.eq(0).html(provinceHtml);
                loading("hide");
            },
            complete: function(xhr) {　　　　
                if (xhr.responseText == 'timeout') {　　　　　
                    tips({
                        content: "请求超时，请重试"
                    });　　　　
                }
                loading("hide");　　
            },
            error: function() {
                loading("hide");
            }
        });
    }

    ctiyList_ul.eq(0).undelegate("click");
    ctiyList_ul.eq(0).delegate("li", "click", function() {

        var _this = $(this);
        var code = _this.attr("code");
        var id = _this.attr("id");

        if (_this.html() != navBar.eq(0).html()) {
            navBar.eq(0).nextAll("span").html("请选择");
        }

        $(".scroll").stop(true, true).animate({ "left": -1 * 1 * ctiyList.width() }, 300, function() {

            _this.addClass("active").siblings().removeClass("active");
            navBar.eq(0).html(_this.html()).removeClass("active");
            navBar.eq(1).addClass("active");

            if (parentId == "#addressPicker") {
                $.ajax({
                    url: api.domainIp + "/dataservice/getCityByJson/" + code,
                    dataType: "jsonp",
                    jsonp: "callback",
                    timeout: 30000,
                    beforeSend: function() {
                        loading("show");
                    },
                    success: function(data) {
                        cityHtml = "";
                        data.forEach(function(el, index) {
                            cityHtml += "<li code=" + el.code + ">" + el.name + "</li>";
                        });
                        ctiyList_ul.eq(1).html(cityHtml);
                        loading("hide");
                    },
                    complete: function(xhr) {　　　　
                        if (xhr.responseText == 'timeout') {　　　　　
                            tips({
                                content: "请求超时，请重试"
                            });　　　　
                        }
                        loading("hide");　　
                    },
                    serror: function() {
                        loading("hide");
                    }
                });
            }

        });
    });

    ctiyList_ul.eq(1).undelegate("click");
    ctiyList_ul.eq(1).delegate("li", "click", function() {

        var _this = $(this);
        var code = _this.attr("code");

        _this.addClass("active").siblings().removeClass("active");
        navBar.eq(1).html($(this).html());
        //$(".cityMask").click();

        $("body").css({
            height: "",
            overflow: ""
        });

        $(".scroll").stop(true, true).animate({ "left": -1 * 2 * ctiyList.width() }, 300, function() {

            _this.addClass("active").siblings().removeClass("active");
            navBar.eq(1).html(_this.html()).removeClass("active");
            navBar.eq(2).addClass("active");

            $.ajax({
                url: api.domainIp + "/dataservice/getDistrictByJson/" + code,
                dataType: "jsonp",
                jsonp: "callback",
                beforeSend: function() {
                    loading("show");
                },
                success: function(data) {

                    var districtHtml = ""
                    data.forEach(function(el, index) {
                        districtHtml += "<li code=" + el.code + ">" + el.name + "</li>"
                    })
                    ctiyList_ul.eq(2).html(districtHtml);
                    loading("hide")
                }
            })
        })
    });

    ctiyList_ul.eq(2).undelegate("click");
    ctiyList_ul.eq(2).delegate("li", "click", function() {
        var _this = $(this);
        var code = _this.attr("code");

        $(showEl).attr({
            "code": code
        }).html(navBar.eq(0).html() + " " + navBar.eq(1).html() + " " + $(this).html());

        _this.addClass("active").siblings().removeClass("active");
        $(".cityMask").click();

    })
}

export const uploadImg = function(id, customerNo) {

    var input = $(id).get(0);
    var imgType = $(id).attr("imgType");
    var dataBase64 = "";
    var imgWidth = "";

    if (!input) return;

    input.onchange = function(event) {

        if (!this.value) {
            return;
        }

        if (imgType == "BUSINESS_LICENSE") {
            imgWidth = 1000;
        } else {
            imgWidth = 700;
        }

        showImg(event, $(id));
        this.value = "";
        loading("show");

    };

    function showImg(ev, obj) { //显示上传的图片

        var file = ev.target.files;
        try {
            var reader = new FileReader();
            reader.readAsDataURL(file[0]);
            reader.onload = function(e) {
                var url = e.target.result; //e.target.result 是base64编码
                lrz(url, { width: imgWidth }, function(results) { //压缩图片的插件
                    dataBase64 = results.base64;
                    if (dataBase64 !== "") {
                        jQuery.ajax({
                            url: api.testIp + 'qualificationFile/uploadQualificationImg',
                            type: 'POST',
                            dataType: 'json',
                            data: {
                                "imgStr": dataBase64,
                                "customerNo": customerNo,
                                "imgType": imgType,
                                "sign": useMd5([
                                    { "imgStr": dataBase64 },
                                    { "customerNo": customerNo },
                                    { "imgType": imgType }
                                ])
                            },
                            success: function(data) {
                                //console.log(data)
                                if (data.code == "0000") {

                                    $(id).attr("filePath", data.data);

                                    tips({
                                        content: "图片上传成功",
                                        type: "success"
                                    });
                                    obj.next(".preload").find("img").attr("src", dataBase64);
                                } else {
                                    tips({
                                        content: "图片上传失败，请稍后重试"
                                    });
                                }
                                loading("hide");
                            },
                            error: function(error) {
                                tips({
                                    content: "请求服务失败，请稍后重试！"
                                });
                                loading("hide");
                            }
                        });
                    }
                });
            };
        } catch (e) {
            console.log(e);
        }
    }
};

//上传结算卡
export const upSettlementImg = function(id, customerNo, loginKey, cardType) {

    var input = $(id).get(0);
    var imgType = $(id).attr("imgType");
    var dataBase64 = "";

    if (!input) return;

    input.onchange = function(event) {

        if (!this.value) {
            return;
        }
        showImg(event, $(id));
        this.value = "";
        loading("show");

    };

    function showImg(ev, obj) { //显示上传的图片

        var file = ev.target.files;
        try {
            var reader = new FileReader();
            reader.readAsDataURL(file[0]);
            reader.onload = function(e) {
                var url = e.target.result; //e.target.result 是base64编码
                lrz(url, { width: 400 }, function(results) { //压缩图片的插件
                    dataBase64 = results.base64;
                    if (dataBase64 !== "") {
                        jQuery.ajax({
                            url: api.testIp + 'customer/settleCard/changefileUpload',
                            type: 'POST',
                            dataType: 'json',
                            data: {
                                "file": dataBase64,
                                "customerNo": customerNo,
                                "loginKey": loginKey,
                                "cardType": cardType,
                                "sign": useMd5([
                                    { "file": dataBase64 },
                                    { "customerNo": customerNo },
                                    { "loginKey": loginKey },
                                    { "cardType": cardType }
                                ])
                            },
                            success: function(data) {
                                console.log(data);
                                if (!data) return;
                                if (data.code == "0000") {
                                    $(id).attr("filePath", data.data);
                                    tips({
                                        content: "图片上传成功",
                                        type: "success"
                                    });
                                    obj.next(".preload").find("img").attr("src", dataBase64);
                                } else {
                                    tips({
                                        content: data.msg
                                    });
                                }
                                loading("hide");
                            },
                            error: function(error) {
                                tips({
                                    content: "请求服务失败，请稍后重试！"
                                });
                                loading("hide");
                            }
                        });
                    }
                });
            };
        } catch (e) {
            console.log(e);
        }
    }
};

//ocr方法上传；
export const intGetData = function(oUrl, id, nameEl, idCardEl, callback) {

    var _data = '';
    var dataBase64 = '';
    var _ocrType = '';

    var inputElement = document.getElementById(id);

    //console.log("oUrl："+oUrl)
    if (!inputElement) return;

    inputElement.onchange = function(event) {

        if (!this.value) {
            return;
        }

        loading("show");

        _ocrType = inputElement.getAttribute('data_card');
        showImg(event, inputElement);

        this.value = "";
    };


    function ajaxType(str, oUrl, ocrType, obj1, obj2) {

        $.ajax({
            type: "POST",
            url: oUrl,
            data: str,
            timeout: 30000,
            dataType: 'json',
            success: function(data) {

                loading("hide");
                console.log(data);
                if (data.message) {
                    if (data.message.value == "识别成功") {
                        tips({
                            'content': data.message.value,
                            'type': 'success'
                        });
                    } else {
                        tips({
                            'content': "识别失败！"
                        });
                    }
                }

                if (data.cardinfo) {

                    obj1.val("");
                    obj2.val("");

                    obj1.attr({ "data-val": "" });
                    obj2.attr({ "data-val": "" });

                    obj1.val(
                        ocrType == "2" ? data.cardinfo.name : data.cardinfo.bankNo
                    );
                    obj2.val(data.cardinfo.idno);

                    obj1.attr({ "data-val": ocrType == "2" ? data.cardinfo.name : data.cardinfo.bankNo });
                    obj2.attr({ "data-val": data.cardinfo.idno });

                    if (typeof callback == "function") {
                        callback();
                    }

                }


            },
            error: function() {
                loading("hide");
                tips({
                    content: "识别失败！"
                });
            }
        });
    }

    function showImg(ev, obj) { //显示上传的图片

        var file = ev.target.files;
        try {
            var reader = new FileReader();
            reader.readAsDataURL(file[0]);
            reader.onload = function(e) {
                var url = e.target.result; //e.target.result 是base64编码
                lrz(url, { width: 400 }, function(results) { //压缩图片的插件
                    dataBase64 = results.base64;
                    if (dataBase64 !== "") {
                        _data = {
                            'ocrType': _ocrType,
                            'resultType': 'json',
                            'img': dataBase64
                        }; //这个是上线后使用的
                        ajaxType(_data, oUrl, _ocrType, $(nameEl), $(idCardEl));
                    }
                });
            };
        } catch (e) {
            console.log(e);
        }
    }
};
