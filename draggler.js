var dragLibrary = function () {
    //返回dom实体
    this.entity = function (tagtype) {
        return document.createElement(tagtype);
    }
    //返回js dom子代jq
    this.ChildArr = function (dragdom) {
        return $(dragdom).children();
    }
    this.ParentPercent = function (cssName, jqdom) {
        var parentheight = parseFloat(jqdom.parent().css(cssName));
        var jqheight = 0;
        switch (cssName) {
            case "height": {
                var border=parseFloat(jqdom.css("border-top"))+parseFloat(jqdom.css("border-bottom"));
                var margin=parseFloat(jqdom.css("margin-top"))+parseFloat(jqdom.css("margin-bottom"));
                jqheight = parseFloat(jqdom.css(cssName)) + margin + border;
            }
            case "width": {
                var border = parseFloat(jqdom.css("border-left")) + parseFloat(jqdom.css("border-right"));
                var margin = parseFloat(jqdom.css("margin-left")) + parseFloat(jqdom.css("margin-right"));
                jqheight = parseFloat(jqdom.css(cssName)) + margin + border;
            }
        }
        var Percent = Math.round(jqheight * 100 / parentheight) + "%";
        return Percent
    }
    this.jsonclone = function (old_object, new_object) {
        for (var key in new_object) {
            if (typeof old_object[key] != typeof new_object[key]) {
                console.warn(key + "类型错误");
                return;
            } else if (typeof old_object[key] == "object") {
                this.jsonclone(old_object[key], new_object[key]);
            } else if (old_object[key] != undefined) {
                old_object[key] = new_object[key];
            }
            // else {
            //     console.warn(key+"参数不存在,请核对");
            //     return;
            // }
        }
    }
    //jquery dom位置互换
    this.exchange = function (before, after) {
        var dragindex=before.attr("data-dragboxindex");
        before.attr("data-dragboxindex",after.attr("data-dragboxindex"));
        after.attr("data-dragboxindex",dragindex);
        after.insertBefore(before);
    }
    //默认dragover函数
    this.dragover = function (ev) {
        ev.preventDefault();
    }
    //object数据拷贝
    this.objectclone = function (old_object, new_object) {
        for (var key in new_object) {
            if (typeof old_object[key] != typeof new_object[key]) {
                console.warn(key + "类型错误");
                return;
            } else if (old_object[key] != undefined) {
                old_object[key] = new_object[key];
            }
        }
    }
    // 去重
    this.array_remove_repeat = function(a) { 
        var r = [];
        for (var i = 0; i < a.length; i++) {
            var flag = true;
            var temp = a[i];
            for (var j = 0; j < r.length; j++) {
                if (temp === r[j]) {
                    flag = false;
                    break;
                }
            }
            if (flag) {
                r.push(temp);
            }
        }
        return r;
    }
    // 差集 a - b
    this.array_diffence = function(a, b) { 
        //clone = a
        var clone = a.slice(0);
        for (var i = 0; i < b.length; i++) {
            var temp = b[i];
            for (var j = 0; j < clone.length; j++) {
                if (temp === clone[j]) {
                    //remove clone[j]
                    clone.splice(j, 1);
                }
            }
        }
        return array_remove_repeat(clone);
    }
    //控件样式修改事件
    this.dragclick=function(jqdom,clicktype){
        $("[data-dragcheck=checked]").removeClass("dragcheck");
        jqdom.addClass("dragcheck")
        $(".config_text").attr({ "disabled": "true", "data-enable": "false" }).val("").parent().hide();
        switch(clicktype){
            case "img":{               
                //可修改样式显示
                $("[data-configtype=src][data-style=background]")
                .removeAttr("disabled").attr("data-enable","true")
                .parent().show();
                $("[data-configtype=style][data-style=height]")
                .removeAttr("disabled").attr("data-enable", "true")
                .parent().show();
                //百分比
                var Percent=this.ParentPercent("height", jqdom);
                $("[data-style=height]").val(Percent);
                //属性对象绑定
                $(".config_container").attr({
                    "data-dragtype": jqdom.attr("data-tagname"),
                    "data-dragindex": jqdom.parent().attr("data-dragboxindex"),
                    "data-controlstates": jqdom.attr("data-controlstates"),
                }).html("图片");
            }
            break;
            case "form": {
                //可修改样式显示
                $("[data-configtype=style][data-style!=width]").removeAttr("disabled").attr("data-enable","true")
                .parent().show();
                $("[data-configtype=src][data-style=background]")
               .removeAttr("disabled").attr("data-enable", "true")
               .parent().show();
                //$("[data-configtype=bgcolorpicker]").removeAttr("disabled");
                //$("[data-style=width]").parent().hide();
                //属性初始化
                var formbg = jqdom.find("[data-dragtype=formimg]");

                var Percent = this.ParentPercent("height", jqdom);
                // $("[data-style=width]").val(formbg.css("width"));
                $("[data-style=height]").val(Percent);
                $("[data-style=background-color]").val(formbg.css("background-color"));
                
                //属性对象绑定
                $(".config_container").attr({
                    "data-dragtype": jqdom.attr("data-dragtype"),
                    "data-dragindex": jqdom.attr("data-dragboxindex"),
                    "data-controlstates": jqdom.attr("data-controlstates"),
                }).html("表单")
            }
            break;
            case "SingleText": {
                //可修改样式显示
                $("[data-configtype=style][data-configtype!=background-color]").removeAttr("disabled").attr("data-enable", "true")
                .parent().show();
                $("[data-configtype=order]").removeAttr("disabled").attr("data-enable","true")
                .parent().show();
                $("[data-configtype=text]").removeAttr("disabled").attr("data-enable","true")
                .parent().show();
                $("[data-configtype=tips]").removeAttr("disabled").attr("data-enable", "true")
                .parent().show();
                $("[data-configtype=RegExp]").removeAttr("disabled").attr("data-enable","true")
                .parent().show();
                $("[data-configtype=m_top]").removeAttr("disabled").attr("data-enable","true")
                .parent().show();
                //$("[data-configtype=bgcolorpicker]").removeAttr("disabled");
                //$("[data-configtype=colorpicker]").removeAttr("disabled");
                var Percent = this.ParentPercent("width", jqdom);
                //属性初始化
                //var parentwidth =parseFloat(jqdom.parent().css("width"));
                //var jqwidth =parseFloat(jqdom.css("width"))+parseFloat(jqdom.css("border-left"));
                //var Percent = Math.round(jqwidth * 100 / parentwidth) + "%";
                $("[data-style=width]").val(Percent);
                $("[data-style=height]").val(jqdom.css("height"));
                $("[data-style=text]").val(jqdom.attr("placeholder"));
                $("[data-style=color]").val(jqdom.css("color"));
                $("[data-style=background-color]").val(jqdom.css("background-color"));
                $("[data-style=font-size]").val(jqdom.css("font-size"));
                $("[data-configtype=order]").val(jqdom.css("order"));
                $("[data-configtype=m_top]").val(jqdom.css("margin-top"));
                data_RegExp = jqdom.attr("data-RegExp");
                $("[data-configtype=RegExp]").val(data_RegExp);
                
                //属性对象绑定
                $(".config_container").attr({
                    "data-dragtype": jqdom.attr("data-tagname"),
                    "data-dragindex": jqdom.attr("data-dragindex"),
                    "data-controlstates": jqdom.attr("data-controlstates"),
                }).html("单行输入框")
            }
            break;
            case "select": {
                //可修改样式显示
                $("[data-configtype=style][data-configtype!=background-color]").removeAttr("disabled").attr("data-enable", "true")
                .parent().show();
                $("[data-configtype=text]").removeAttr("disabled").attr("data-enable","true")
                .parent().show();
                $("[data-configtype=order]").removeAttr("disabled").attr("data-enable","true")
                .parent().show();
                $("[data-configtype=select]").removeAttr("disabled").attr("data-enable","true")
                .parent().show();
                $("[data-configtype=m_top]").removeAttr("disabled").attr("data-enable","true")
                .parent().show();
                //属性初始化
                var Percent = this.ParentPercent("Width", jqdom);
                //var parentwidth = parseFloat(jqdom.parent().css("width"));
                //var jqwidth = parseFloat(jqdom.css("width")) + parseFloat(jqdom.css("border-left"));
                //var Percent = Math.round(jqwidth * 100 / parentwidth) + "%";
                $("[data-style=width]").val(Percent);
                $("[data-style=height]").val(jqdom.css("height"));
                $("[data-style=color]").val(jqdom.css("color"));
                $("[data-style=font-size]").val(jqdom.css("font-size"));
                $("[data-configtype=order]").val(jqdom.css("order"));
                $("[data-configtype=select]").val(jqdom.attr("data-options"));
                $("[data-configtype=m_top]").val(jqdom.css("margin-top"));
                //属性对象绑定             
                $(".config_container").attr({
                    "data-dragtype": jqdom.attr("data-tagname"),
                    "data-dragindex": jqdom.attr("data-dragindex"),
                    "data-controlstates": jqdom.attr("data-controlstates"),
                }).html("下拉框")
            }
            break;
            case "button": {
                //可修改样式显示
                $("[data-configtype=style]").removeAttr("disabled").attr("data-enable", "true")
                .parent().show();
                $("[data-configtype=text]").removeAttr("disabled").attr("data-enable","true")
                .parent().show();
                $("[data-configtype=order]").removeAttr("disabled").attr("data-enable","true")
                .parent().show();
                $("[data-configtype=tips]").removeAttr("disabled").attr("data-enable","true")
                .parent().show();
                $("[data-configtype=m_top]").removeAttr("disabled").attr("data-enable","true")
                .parent().show();
                //$("[data-style=background]").attr("data-enable", "false")
                //.parent().hide();               
                //属性初始化
                var Percent = this.ParentPercent("width", jqdom);
                //var parentwidth = parseFloat(jqdom.parent().css("width"));
                //var jqwidth = parseFloat(jqdom.css("width")) + parseFloat(jqdom.css("border-left"));
                //var Percent = Math.round(jqwidth * 100 / parentwidth) + "%";
                $("[data-style=width]").val(Percent);
                $("[data-style=height]").val(jqdom.css("height"));
                $("[data-style=text]").val(jqdom.html());
                $("[data-style=color]").val(jqdom.css("color"));
                $("[data-style=background-color]").val(jqdom.css("background-color"));
                $("[data-style=font-size]").val(jqdom.css("font-size"));
                $("[data-configtype=order]").val(jqdom.css("order"));
                $("[data-configtype=m_top]").val(jqdom.css("margin-top"));
                //属性对象绑定  
                $(".config_container").attr({
                    "data-dragtype": jqdom.attr("data-tagname"),
                    "data-dragindex": jqdom.attr("data-dragindex"),
                    "data-controlstates": jqdom.attr("data-controlstates"),
                }).html("按钮")
            }
        }
    }
}
function previewImage(file, jqdom) {
    var MAXWIDTH = 200;
    var MAXHEIGHT = 400;
    var dragboxindex=jqdom.attr("data-dragindex");
    var Previewtype=jqdom.attr("data-dragtype");
    var img = null;
    //图片元素选择
    switch(Previewtype){
        case "form" :{
            img=$("[data-dragtype=formimg]")[0];
        }
        break;
        case "img":{
            img=$("[data-dragboxindex="+dragboxindex+"]"+"[data-dragtype=normal]").find("[data-dragindex=1]")[0];
        }
    }
    //图片元素加载
    if (file.files && file.files[0]) {
        img.onload = function () {
            //var rect = clacImgZoomParam(MAXWIDTH, MAXHEIGHT, img.offsetWidth, img.offsetHeight);
            //console.info(rect);
            //img.width = rect.width;
            //img.height = rect.height;
            $("[data-style=height]").val(img.height);
        }
        var reader = new FileReader();
        reader.onload = function (evt) { img.src = evt.target.result; }
        reader.readAsDataURL(file.files[0]);
    }
    else //
    {
        var sFilter = 'filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale,src="';
        file.select();
        var src = document.selection.createRange().text;
        // div.innerHTML = '<img id=imghead' + imgNum + '>';
        img.filters.item('DXImageTransform.Microsoft.AlphaImageLoader').src = src;

        //var rect = clacImgZoomParam(MAXWIDTH, MAXHEIGHT, img.offsetWidth, img.offsetHeight);

        $("[data-style=height]").val(img.height);

        //console.info(rect);
        //status = ('rect:' + rect.top + ',' + rect.left + ',' + rect.width + ',' + rect.height);
        //alert(status);
        // div.innerHTML = "<div id=divhead" + imgNum + " style='width:" + rect.width + "px;height:" + rect.height + "px;" + rect.top + "px;" + sFilter + src + "\"'></div>";
    }
}
function clacImgZoomParam(maxWidth, maxHeight, width, height) {
    var param = { top: 0, left: 0, width: width, height: height };
    if (width > maxWidth || height > maxHeight) {
        rateWidth = width / maxWidth;
        rateHeight = height / maxHeight;

        if (rateWidth > rateHeight) {
            param.width = maxWidth;
            param.height = Math.round(height / rateWidth);
        } else {
            param.width = Math.round(width / rateHeight);
            param.height = maxHeight;
        }
    }
    param.left = Math.round((maxWidth - param.width) / 2);
    param.top = Math.round((maxHeight - param.height) / 2);
    return param;
}
var dragbox = function (config, returntype) {
    this.config = {
        childtag: "",
        // normaldrop: function (ev) {
        // },
        type: "normal", //form ,container,normal,form_controls    required! 盒子装载类型
        tagtype: "div", // required! default  domtag
        class: "dragnormalbox", // optional 
        id: "", //optional
        defaults: {
            boxtype: "single", //盒子类型  single,mixed, required!
            Nested: "false", //是否可嵌套 required bool default
        },
        style: { //optional

        },
        events: {
            click: function () {

            }
        }
    }
    var dom = this.init(config);
    // return dom;
}
//#endregion
//#region 拖动盒子 默认div
dragbox.prototype = {
    init: function (config) {
        if (config == undefined || config == null) {
            console.log("未初始化");
            return;
        } //配置参数 object
        // this.config = 
        var othis = this;
        this.dragUtilities.jsonclone(this.config, config);
        this.dragdom = this.init_create();
        // return this.dragdom;
    },
    //#region dom函数
    //存储dom对象
    dragdom: null,
    boxclass: "dragboxbase", //默认盒子样式
    containerclass: "dragboxcontainer",
    dragboxindex: "", //盒子标识
    //dom初始化
    init_create: function () {
        var config = this.config;
        // js,jq对象
        var jsdom = this.dragUtilities.entity(this.config.tagtype);
        var jqdom = $(jsdom);
        //默认参数绑定
        jqdom.attr({
            "data-dragtype": config.type,
            "id": config.id
        })
        //data-dragindex设置 box数量设置    
        var index = 1;
        var dom = $("[data-dragboxindex][data-dragtype=" + config.type + "]");
        //基类控件
        if (config.type == "container") {
            index = 0;
        } else {
            for (var i = 0; i < dom.length; i++) {
                dom.eq(i).attr("data-dragboxindex", index);
                index++;
            }
        }
        jqdom.attr("data-dragboxindex", index);
        this.dragboxindex = (index).toString();
        // //默认class设置
        // jqdom.addClass(this.class);
        //可选class设置
        if (config.class != "") {
            jqdom.addClass(config.class)
        }

        //data-xx参数绑定
        for (var key in config.defaults) {
            if (config.defaults[key] != "") {
                jqdom.attr("data-" + key, config.defaults[key]);
            }
        }
        //event事件绑定 默认事件绑定
        jsdom.addEventListener("dragover", this.dragUtilities.dragover);
        //normal box drop事件绑定
        switch (config.type) {
            // case "form":
            case "normal":
                jsdom.addEventListener("drop", this.normaldrop);
                jqdom.addClass(this.boxclass);
                break;
            case "container":
                jsdom.addEventListener("drop", this.containerdrop);
                jqdom.addClass(this.containerclass);
                break;
        }
        //可选事件绑定
        for (var key in config.events) {
            jsdom.addEventListener(key, config.events[key]);
        }
        return jsdom;
    },
    dragUtilities: new dragLibrary(),
    //操作台 拖动默认事件
    containerdrop: function (ev) {
        ev.preventDefault();
        var jsdom = ev.target;
        var jqdom = $(ev.target);
        var childtype = ev.dataTransfer.getData("dragtype");
        var parenttype = jqdom.attr("data-dragtype");
        if (childtype != "base" && parenttype != "container") {
            console.log("请注意拖拽操作范围");
            return;
        } else {
            var tagName = ev.dataTransfer.getData("tagName");
            var className = ev.dataTransfer.getData("class");
            switch (tagName.toLowerCase()) {
                case "img":
                    {
                        var src = ev.dataTransfer.getData("src");
                        var Newdraggler = new draggler({
                            type: "normal",
                            Parentid: jsdom.id,
                            boxconfig: {},
                            dragobjecttype: "img",
                            containerconfig: {
                                src: src,
                            }
                        })
                    }
                    break;
                case "form":
                    {
                        var border = ev.dataTransfer.getData("border");
                        var background = ev.dataTransfer.getData("background");
                        var Newdraggler = new draggler({
                            type: "form",
                            Parentid: jsdom.id,
                            boxconfig: {
                                type: "form",
                                defaults: {
                                    boxtype: "mixed",
                                    Nested: "true"
                                }
                            },
                            dragobjecttype: "form",
                            containerconfig: {
                                style: {
                                    width: "65%"
                                }
                            }
                        })
                    }
            }
        }
    },
    //普通拖拽组件 单个
    normaldrop: function (ev) {
        ev.preventDefault();
        var jsdom = ev.target;
        var jqdom = $(ev.target);
        if (jsdom.tagName.toLowerCase() != "div") {
            console.log("请注意拖拽操作范围");
            return;
        }
        var childtype = ev.dataTransfer.getData("dragtype");
        var parenttype = jqdom.attr("data-dragtype");
        if (childtype == "form") {
            var formindex=ev.dataTransfer.getData("formindex");
            var form = $("[data-dragtype=form][data-dragboxindex="+formindex+"]");
            var change = Picfile[formindex];
            if (jqdom.children().eq(0).attr("data-tagname") == "img") {
                Picfile[formindex] = Picfile[index];
                Picfile[index] = change;
            }
            var preindex = jqdom.index() > form.index() ? 0 : 1;
            var utilities = new dragLibrary();
            switch (preindex) {
                case 0:
                    utilities.exchange(form, jqdom);
                    break;
                case 1:
                    utilities.exchange(jqdom, form);
            }
        } else if (parenttype != childtype) {
            console.log("请注意拖拽操作范围");
            return;
        } else {
            // var id = ev.dataTransfer.getData("id");
            var origin = ev.dataTransfer.getData("origin");
            var jqorigin = $("[data-dragtype=" + childtype + "][data-dragboxindex=" + origin + "]");
            var jsorigin = jqorigin[0];

            var jqSingledrag = jqorigin.children().eq(0);
            var jsSingledrag = jqSingledrag[0];
            var change = Picfile[index];
            if (jqSingledrag.attr("data-tagname") == "img") {
                Picfile[index] = Picfile[origin];
                Picfile[origin] = change;
            }
            ev.target.appendChild(jsSingledrag);
            jsorigin.appendChild($(ev.target).children()[0]);
        }
        ev.stopPropagation();
    },
}
//#endregion dragbox

//#region drag组件基类


//#region 图片拖动件  
var dragimg = function (config) {
    //私有参数  配置参数表
    this.config = {
        type: "normal", //normal ,form_control,form,base
        tagtype: "img",
        class: "dragimgbase", //默认tagtype  
        draggable: "true",
        id: "",
        src: "",
        title: "点击修改样式",
        alt: "图片不存在",
        parent: "",
        // dragstart: function (ev) {

        // }, //dragstart 拖动物体事件
        defaults: {
            // index: "" //data-dragindex
            tagName: "img",
            dragcheck: "checked",
            ControlStates: "create",
            ControlId:"null"
        },
        style: {}, //css参数表
        events: {
            click: function (ev) {
                var utilities = new dragLibrary();
                utilities.dragclick($(this),"img");
                // $("[data-dragcheck=checked]").removeClass("dragcheck");
                // $(this).addClass("dragcheck")
                // $(".config_text").attr({"disabled":"true","data-enable":"false"});
                // // different
                // $("[data-configtype=style]").removeAttr("disabled").attr("data-enable","true");
                // $("[data-configtype=html]").removeAttr("disabled").attr("data-enable","true");

                // $(".config_container").attr({
                //     "data-dragtype":$(this).attr("data-dragtype"),
                //     "data-dragindex":$(this).attr("data-dragindex")
                // })
                ev.stopPropagation();              
            }
        }
    }
    this.dragdom = null;
    this.init(config);
}
dragimg.prototype = {
    init: function (config) {
        var othis = this;
        this.dragUtilities.jsonclone(this.config, config);
        this.dragdom = this.init_create();
    },
    start: function () {},
    init_create: function () {
        var config = this.config;
        // js,jq对象
        var jsdom = this.dragUtilities.entity(this.config.tagtype);
        var jqdom = $(jsdom);
        //data-xx参数绑定
        for (var key in config.defaults) {
            if (config.defaults[key] != "") {
                jqdom.attr("data-" + key, config.defaults[key]);
            }
        }
        //可选class设置
        if (config.class != "") {
            jqdom.addClass(config.class);
        }
        // if (this.class != "") {
        //     jqdom.addClass(this.class);
        // }
        //默认参数绑定
        jqdom.attr({
            // "class": config.class,
            "data-dragtype": config.type,
            "src": config.src,
            "id": config.id,
            "draggable": config.draggable,
            // "alt": "请选择图片地址",
            "title": config.title,
        })
        // else {
        //     this.parent = "none";
        // }
        //event事件绑定      

        //可选事件绑定
        for (var key in config.events) {
            jsdom.addEventListener(key, config.events[key]);
        }
        //控件类型 参数、事件绑定
        if (config.type == "normal") {
            //事件
            jsdom.addEventListener("dragstart", this.normaldragstart)
            //dom添加
            var node = document.createTextNode("");
            jsdom.appendChild(node);
            //parent内该控件数量 ————控件标识 data-dragindex
            if (config.parent != "") {
                var parent = $("[data-dragtype=" + config.type + "][data-dragboxindex=" + config.parent + "]")[0];
                if (parent != undefined) {
                    var dom = $(parent).find("[data-dragindex]");
                    var index = 1;
                    for (var i = 0; i < dom.length; i++) {
                        dom.eq(i).attr("data-dragindex", index);
                        index++;
                    }
                    jqdom.attr("data-dragindex", index);
                    parent.appendChild(jsdom);
                } else {
                    console.warn("parent不存在");
                }
            }
        } else if (config.type == "base") {
            //事件
            jsdom.addEventListener("dragstart", this.basedragstart)
            //dom添加
            if (config.parent != "") {
                jqdom.attr("data-dragindex", 0);
                document.getElementById(config.parent).appendChild(jsdom);
            } else {
                console.warn("parent不存在");
            }
        }
        return jsdom;
    },
    dragboxindex: "1",
    // dragdom: null,
    class: "",
    dragUtilities: new dragLibrary(),
    normaldragstart: function (ev) {
        var parent = $(ev.target).parent();
        // ev.dataTransfer.setData("id",ev.target.id);
        ev.dataTransfer.setData("origin", parent.attr("data-dragboxindex"));
        ev.dataTransfer.setData("dragtype", $(ev.target).attr("data-dragtype"));
    },
    basedragstart: function (ev) {
        var jsdom = ev.target;
        var jqdom = $(jsdom);
        ev.dataTransfer.setData("tagName", jsdom.tagName);
        ev.dataTransfer.setData("dragtype", jqdom.attr("data-dragtype"));
        ev.dataTransfer.setData("src", jqdom.attr("src")); //默认图片
        ev.dataTransfer.setData("class", jqdom.attr("class"));
        ev.dataTransfer.setData("alt", jqdom.attr("alt"));
    },
}
//#endregion

//form组件 
var dragformbox = function (config) {
    this.config = {
        type: "form", //normal ,form_control,form,base
        tagtype: "div",
        class: "dragformbase", //默认tagtype  
        draggable: "true",
        id: "",
        Parentid: "",
        title: "点击修改样式",
        defaults: {
            // index: "" //data-dragindex
            dragcheck: "checked",
        },
        style: {
            "background": "",
            "border": "",
            "height": "",
            "width": ""
        }, //css参数表
        events: {
            click: function (ev) {
                var utilities = new dragLibrary();
                utilities.dragclick($(this),"form");
                ev.stopPropagation();              
            }
        }
    }
    this.init(config);
}
dragformbox.prototype = {
    init: function (config) {
        var othis = this;
        this.dragUtilities.jsonclone(this.config, config);
        this.dragdom = this.init_create();
    },
    init_create: function () {
        var config = this.config;
        // js,jq对象
        var jsdom = this.dragUtilities.entity(this.config.tagtype);
        var jqdom = $(jsdom);
        //data-xx参数绑定
        for (var key in config.defaults) {
            if (config.defaults[key] != "") {
                jqdom.attr("data-" + key, config.defaults[key]);
            }
        }
        //可选class设置
        if (config.class != "") {
            jqdom.addClass(config.class);
        }
        if (this.class != "") {
            jqdom.addClass(this.class);
        }
        //默认参数绑定
        jqdom.attr({
            // "class": config.class,
            "data-dragtype": config.type,
            "id": config.id,
            "draggable": config.draggable,
            "title": config.title,
        })
        //style 绑定
        jqdom.css(config.style)

        //event事件绑定      

        //可选事件绑定
        for (var key in config.events) {
            jsdom.addEventListener(key, config.events[key]);
        }
        //控件类型 参数、事件绑定
        if (config.type == "form") {
            //事件
            jsdom.addEventListener("drop", this.formboxdrop)
            jqdom.attr("draggable", "true");
            jsdom.addEventListener("dragstart", this.formdragstart);
            //dom添加
            var node = document.createTextNode("");
            jsdom.appendChild(node);
            //parent内该控件数量 ————控件标识 data-dragindex
            var index = 1;
            // var dom = $("[data-dragboxindex][data-dragtype=" + config.type + "]");
            var dom = $("[data-dragboxindex][data-dragtype=normal]");
            //form控件  限制为1
            //基类控件
            for (var i = 0; i < dom.length; i++) {
                dom.eq(i).attr("data-dragboxindex", index);
                index++;
            }
            var formdom = $("[data-dragboxindex][data-dragtype=form]");
            if (formdom.length != 0) {
                return null;
            }
            jqdom.attr("data-dragboxindex", index);
            this.dragboxindex = (index).toString();
            //背景图片
            var bgimg=this.dragUtilities.entity("img");
            var jqbgimg=$(bgimg);
            jqbgimg.addClass("dragformbg");
            jqbgimg.attr({
                "data-dragboxindex":"1",
                "data-dragtype":"formimg"
            })
            jsdom.appendChild(bgimg);
        } else if (config.type == "base") {
            //事件
            jsdom.addEventListener("dragstart", this.basedragstart)
            //dom添加
            if (config.parent != "") {
                jqdom.attr("data-dragindex", 0);
                document.getElementById(config.Parentid).appendChild(jsdom);
            } else {
                console.warn("parent不存在");
            }
        }
        return jsdom;
    },
    dragUtilities: new dragLibrary(),
    class: "dragformbox",
    dragdom: null,
    dragboxindex: "1",
    //form表单盒子
    formboxdrop: function (ev) {
        ev.preventDefault();
        var jsdom = ev.target;
        var jqdom = $(ev.target);
        var childtype = ev.dataTransfer.getData("dragtype");
        var parenttype = jqdom.attr("data-dragtype");
        var index=jqdom.attr("data-dragboxindex");
        if (childtype != "form_control") {
            console.log("请注意拖拽操作范围");
        } else {
            var tagName = ev.dataTransfer.getData("tagName");
            var classname = ev.dataTransfer.getData("class");
            switch (tagName) {
                case "label":
                    {
                        var Newdraglabel = new draglabel({
                            draggable: "false",
                            class: classname,
                            parent:index,
                        })
                    }
                    break;
                case "text":
                    {
                        var Newdragtextinput = new dragtextinput({
                            draggable: "false",
                            class: classname,
                            parent:index,
                        })
                    }
                    break;
                case "select":
                    {
                        var options = ev.dataTransfer.getData("options");
                        var Newdragselect = new dragselect({
                            draggable: "false",
                            class: classname,
                            parent:index,
                            defaults: {
                                options: options
                            }
                        })
                    }
                    break;
                case "button":
                    {
                        var Newdragbutton = new dragbutton({
                            draggable: "false",
                            class: classname,
                            parent:index,
                        })
                    }
            }
        }
        ev.stopPropagation();
    },
    formdragstart: function (ev) {
        var jsdom = ev.target;
        var jqdom = $(jsdom);
        // ev.dataTransfer.setData("id",ev.target.id);
        ev.dataTransfer.setData("dragtype", jqdom.attr("data-dragtype"));
        ev.dataTransfer.setData("formindex",jqdom.attr("data-dragboxindex"));
    },
    basedragstart: function (ev) {
        var jsdom = ev.target;
        var jqdom = $(ev.target);
        ev.dataTransfer.setData("tagName", "form");
        ev.dataTransfer.setData("dragtype", jqdom.attr("data-dragtype"));
        ev.dataTransfer.setData("class", jqdom.attr("class"));
        ev.dataTransfer.setData("border", jqdom.css("border"));
        ev.dataTransfer.setData("background", jqdom.css("background"));
    },

}


//label 控件
var draglabel = function (config) {
    this.config = {
        type: "form_control", //normal ,form_control,form,base,label
        tagtype: "label",
        class: "draglabelbase", //默认tagtype  
        draggable: "true",
        id: "",
        parent: "1",
        defaults: {
            // index: "" //data-dragindex
            tagName: "label"
        },
        style: {

        }, //css参数表
        events: {
            click: function () {

            }
        }
    }
    this.dragdom = null;
    this.init(config);
}
draglabel.prototype = {
    init: function (config) {
        var othis = this;
        this.dragUtilities.jsonclone(this.config, config);
        this.dragdom = this.init_create();
    },
    init_create: function () {
        var config = this.config;
        // js,jq对象
        var jsdom = this.dragUtilities.entity(this.config.tagtype);
        var jqdom = $(jsdom);
        //data-xx参数绑定
        for (var key in config.defaults) {
            if (config.defaults[key] != "") {
                jqdom.attr("data-" + key, config.defaults[key]);
            }
        }
        //可选class设置
        if (config.class != "") {
            jqdom.addClass(config.class);
        }
        // if (this.class != "") {
        //     jqdom.addClass(this.class);
        // }

        //默认参数绑定
        jqdom.attr({
            // "class": config.class,
            "data-dragtype": config.type,
            "id": config.id,
            "draggable": config.draggable,
            "type": config.inputtype,
        })

        //可选事件绑定
        for (var key in config.events) {
            jsdom.addEventListener(key, config.events[key]);
        }
        //控件类型 参数、事件绑定

        //dom添加
        var node = document.createTextNode("");
        jsdom.appendChild(node);
        //parent内该控件数量 ————控件标识 data-dragindex
        if (config.parent != "") {
            var parent = $("[data-dragtype=form][data-dragboxindex=" + config.parent + "]")[0];
            if (parent != undefined) {
                var dom = $(parent).find("[data-dragindex]");
                var index = 1;
                for (var i = 0; i < dom.length; i++) {
                    dom.eq(i).attr("data-dragindex", index);
                    index++;
                }
                jqdom.attr("data-dragindex", index);
                //flex order样式修改
                jqdom.css("order", index);
                jqdom.html("提示文本" + index + ":");
                parent.appendChild(jsdom);
            } else {
                console.warn("parent不存在");
            }
        }
        return jsdom;
    },
    dragUtilities: new dragLibrary(),
    class: "",
}

//input 文本输入框
var dragtextinput = function (config) {
    this.config = {
        type: "form_control", //normal ,form_control,form,base
        tagtype: "input",
        inputtype: "text",
        class: "dragtxtbase", //默认tagtype  
        draggable: "true",
        id: "",
        parent: "1",
        tipstxt: "请输入",
        defaults: {
            // index: "" //data-dragindex     
            required: "required",
            RegExp: "",
            dragcheck: "checked",
            tagname:"text",
            //伪类 content  样式暂时跟随input大小一致，操作台不显示   
        },
        style: {

        }, //css参数表
        events: {
            click: function (ev) {
                var utilities = new dragLibrary();
                utilities.dragclick($(this),"SingleText");
                // var jqdom=$(this);
                // $("[data-dragcheck=checked]").removeClass("dragcheck");
                // jqdom.addClass("dragcheck")
                // $(".config_text").attr({"disabled":"true","data-enable":"false"});
                // //可设置参数 显示
                // $("[data-configtype=style]").removeAttr("disabled").attr("data-enable","true");
                // $("[data-configtype=input]").removeAttr("disabled").attr("data-enable","true");
                // $("[data-configtype=RegExp]").removeAttr("disabled").attr("data-enable","true");
                
                // $(".config_container").attr({
                //     "data-dragtype":$(this).attr("data-dragtype"),
                //     "data-dragindex":$(this).attr("data-dragindex")
                // })
                ev.stopPropagation();              
            }
        }
    }
    this.dragdom = null;
    this.init(config);

}
dragtextinput.prototype = {
    init: function (config) {
        var othis = this;
        this.dragUtilities.jsonclone(this.config, config);
        this.dragdom = this.init_create();
    },
    init_create: function () {
        var config = this.config;
        // js,jq对象
        var jsdom = this.dragUtilities.entity(this.config.tagtype);
        var jqdom = $(jsdom);
        //data-xx参数绑定
        for (var key in config.defaults) {
            if (config.defaults[key] != "") {
                jqdom.attr("data-" + key, config.defaults[key]);
            }
        }
        //可选class设置
        if (config.class != "") {
            jqdom.addClass(config.class);
        }
        // if (this.class != "") {
        //     jqdom.addClass(this.class);
        // }
        //默认参数绑定
        jqdom.attr({
            // "class": config.class,
            "data-dragtype": config.type,
            "id": config.id,
            "draggable": config.draggable,
            "type": config.inputtype,
            "placeholder": config.tipstxt,
        })
        // else {
        //     this.parent = "none";
        // }
        //event事件绑定      

        //可选事件绑定
        for (var key in config.events) {
            jsdom.addEventListener(key, config.events[key]);
        }
        //控件类型 参数、事件绑定
        //dom添加
        var node = document.createTextNode("");
        jsdom.appendChild(node);
        //parent内该控件数量 ————控件标识 data-dragindex
        if (config.parent != "") {
            var parent = $("[data-dragtype=form][data-dragboxindex=" + config.parent + "]")[0];
            if (parent != undefined) {
                var dom = $(parent).find("[data-dragindex]");
                var index = 1;
                for (var i = 0; i < dom.length; i++) {
                    dom.eq(i).attr("data-dragindex", index);
                    index++;
                }
                jqdom.attr("data-dragindex", index);
                jqdom.css("order", index);
                // jqdom.val("单行输入框" + index);
                parent.appendChild(jsdom);
            } else {
                console.warn("parent不存在");
            }
        }
        return jsdom;
    },
    dragUtilities: new dragLibrary(),
    class: "",
    dragboxindex: "1",
}

var dragselect = function (config) {
    this.config = {
        type: "form_control",
        tagtype: "select",
        class: "dragselectbase", //默认tagtype  
        draggable: "true",
        id: "",
        parent: "1",
        defaults: {
            // index: "" //data-dragindex
            tagName: "select",
            options: "",
            dragcheck: "checked",
        },
        style: {

        }, //css参数表
        events: {
            click: function (ev) {
                var utilities = new dragLibrary();
                utilities.dragclick($(this),"select");
                // var jqdom=$(this);
                // $("[data-dragcheck=checked]").removeClass("dragcheck");
                // jqdom.addClass("dragcheck")
                // $(".config_text").attr({"disabled":"true","data-enable":"false"});
                // //可设置参数 显示
                // $("[data-configtype=style]").removeAttr("disabled").attr("data-enable","true");
                // $("[data-configtype=input]").removeAttr("disabled").attr("data-enable","true");
                // $("[data-configtype=select]").removeAttr("disabled").attr("data-enable","true");
                
                // $(".config_container").attr({
                //     "data-dragtype":$(this).attr("data-dragtype"),
                //     "data-dragindex":$(this).attr("data-dragindex")
                // })
                ev.stopPropagation();   
            }
        }
    }
    this.dragdom = null;
    this.init(config);
}
dragselect.prototype = {
    init: function (config) {
        var othis = this;
        this.dragUtilities.jsonclone(this.config, config);
        this.dragdom = this.init_create();
    },
    init_create: function () {
        var config = this.config;
        // js,jq对象
        var jsdom = this.dragUtilities.entity(this.config.tagtype);
        var jqdom = $(jsdom);
        //data-xx参数绑定
        for (var key in config.defaults) {
            if (config.defaults[key] != "") {
                jqdom.attr("data-" + key, config.defaults[key]);
            }
        }
        //可选class设置
        if (config.class != "") {
            jqdom.addClass(config.class);
        }
        // if (this.class != "") {
        //     jqdom.addClass(this.class);
        // }

        //默认参数绑定
        jqdom.attr({
            // "class": config.class,
            "data-dragtype": config.type,
            "id": config.id,
            "draggable": config.draggable,
            "type": config.inputtype,
        })

        //多选项绑定  option
        var option = config.defaults.options.replace(/，/ig, ',');
        var optionarr = config.defaults.options.split(",");
        var optionhtml = "";
        for (var i = 0, length = optionarr.length; i < length; i++) {
            optionhtml += "<option value='" + i + "'>" + optionarr[i] + "</option>";
        }
        jqdom.html(optionhtml);
        //可选事件绑定
        for (var key in config.events) {
            jsdom.addEventListener(key, config.events[key]);
        }
        //控件类型 参数、事件绑定

        //dom添加
        var node = document.createTextNode("");
        jsdom.appendChild(node);
        //parent内该控件数量 ————控件标识 data-dragindex
        if (config.parent != "") {
            var parent = $("[data-dragtype=form][data-dragboxindex=" + config.parent + "]")[0];
            if (parent != undefined) {
                var dom = $(parent).find("[data-dragindex]");
                var index = 1;
                for (var i = 0, length = dom.length; i < length; i++) {
                    dom.eq(i).attr("data-dragindex", index);
                    index++;
                }
                jqdom.attr("data-dragindex", index);
                //flex order样式修改
                jqdom.css("order", index);
                parent.appendChild(jsdom);
            } else {
                console.warn("parent不存在");
            }
        }
        return jsdom;
    },
    dragUtilities: new dragLibrary(),
    class: "",
}
var dragbutton = function (config) {
    this.config = {
        type: "form_control", //normal ,form_control,form,base,label
        tagtype: "button",
        class: "dragbuttonbase", //默认tagtype  
        draggable: "true",
        id: "",
        parent: "1",
        defaults: {
            // index: "" //data-dragindex
            tagName: "button",
            buttontype: "submit", //button submit
            dragcheck: "checked",
        },
        style: {

        }, //css参数表
        events: {
            click: function (ev) {
                var utilities = new dragLibrary();
                utilities.dragclick($(this),"button");
                // var jqdom=$(this);
                // $("[data-dragcheck=checked]").removeClass("dragcheck");
                // jqdom.addClass("dragcheck")
                // $(".config_text").attr({"disabled":"true","data-enable":"false"});
                // //可设置参数 显示
                // $("[data-configtype=style]").removeAttr("disabled").attr("data-enable","true");
                // $("[data-configtype=input]").removeAttr("disabled").attr("data-enable","true");
                
                // $(".config_container").attr({
                //     "data-dragtype":$(this).attr("data-dragtype"),
                //     "data-dragindex":$(this).attr("data-dragindex")
                // })
                ev.stopPropagation();   
            }
        }
    }
    this.dragdom = null;
    this.init(config);
}
dragbutton.prototype = {
    init: function (config) {
        var othis = this;
        this.dragUtilities.jsonclone(this.config, config);
        this.dragdom = this.init_create();
    },
    init_create: function () {
        var config = this.config;
        // js,jq对象
        var jsdom = this.dragUtilities.entity(this.config.tagtype);
        var jqdom = $(jsdom);
        //data-xx参数绑定
        for (var key in config.defaults) {
            if (config.defaults[key] != "") {
                jqdom.attr("data-" + key, config.defaults[key]);
            }
        }
        //可选class设置
        if (config.class != "") {
            jqdom.addClass(config.class);
        }
        // if (this.class != "") {
        //     jqdom.addClass(this.class);
        // }
        //默认参数绑定
        jqdom.attr({
            // "class": config.class,
            "data-dragtype": config.type,
            "id": config.id,
            "draggable": config.draggable,
            "type": config.inputtype,
            "placeholder": config.tipstxt,
        })
        // else {
        //     this.parent = "none";
        // }
        //event事件绑定      

        //可选事件绑定
        for (var key in config.events) {
            jsdom.addEventListener(key, config.events[key]);
        }
        //控件类型 参数、事件绑定
        //dom添加
        var node = document.createTextNode("");
        jsdom.appendChild(node);
        //parent内该控件数量 ————控件标识 data-dragindex
        if (config.parent != "") {
            var parent = $("[data-dragtype=form][data-dragboxindex=" + config.parent + "]")[0];
            if (parent != undefined) {
                var dom = $(parent).find("[data-dragindex]");
                var index = 1;
                for (var i = 0; i < dom.length; i++) {
                    dom.eq(i).attr("data-dragindex", index);
                    index++;
                }
                jqdom.attr("data-dragindex", index);
                jqdom.css("order", index);
                jqdom.html("按钮");
                parent.appendChild(jsdom);
            } else {
                console.warn("parent不存在");
            }
        }
        return jsdom;
    },
    dragUtilities: new dragLibrary(),
    class: "",
    dragboxindex: "1",
}
//#region 拖动组件
var draggler = function (config) {
    this.config = {
        type: "", //normal 普通 ，form表单, container fomr_control
        Parentid: "", //父类Id
        boxconfig: {}, //载件参数表
        containerconfig: {}, //控件参数表
        dragobjecttype: ""
    }
    this.init(config);
}
draggler.prototype = {
    init: function (config) {
        this.dragUtilities.objectclone(this.config, config);
        var dom = document.getElementById(this.config.Parentid);
        //控件初始化
        if (this.config.type == "normal") {

            if (dom == null) {
                console.error("插入对象未指明");
            }
            this.dragbox = new dragbox(this.config.boxconfig);
            dom.appendChild(this.dragbox.dragdom);
            this.config.containerconfig.parent = this.dragbox.dragboxindex;
            switch (this.config.dragobjecttype) {
                case "img":
                    this.dragcontainer = new dragimg(this.config.containerconfig);
                    break;
            }
        } else if (this.config.type == "container") {
            this.config.boxconfig.type = "container";
            this.dragbox = new dragbox(this.config.boxconfig);
            $(this.dragbox.dragdom).addClass("operation");
            $(".col.components").after(this.dragbox.dragdom);
        } else if (this.config.type == "form") {
            this.dragform = new dragformbox(this.config.containerconfig);
            if (this.dragform.dragdom != null) dom.appendChild(this.dragform.dragdom);
            else console.warn("表单控件只能挂取一个");
        }
    },
    //辅助函数
    dragUtilities: new dragLibrary(),
    //共有参数
    dragbox: null,
    dragcontainer: null,
    dragForm: null,

}