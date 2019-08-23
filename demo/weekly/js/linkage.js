/**
 * 省市联动
 * @param config
 * linkage(config);
 * 2017/8/1
 */
console.log("假的省市联动")
var where = {"黑龙江":{"双鸭山市":["广汽传祺博大店"],"七台河市":["广汽传祺弘远店"],"佳木斯市":["广汽传祺佳木斯通途店"]},"吉林":{"白山市":["广汽传祺通展店"],"通化市":["广汽传祺胜笛店"],"梅河口市":["广汽传祺梅河口广进店"],"吉林市":["广汽传祺吉林成祺店"],"延吉市":["广汽传祺中荣店"]},"辽宁":{"葫芦岛市":["广汽传祺卓远店"],"朝阳市":["广汽传祺泰骏达店"],"盘锦市":["广汽传祺弘茂店"]},"内蒙古":{"赤峰市":["广汽传祺森航店"]},"河北":{"石家庄市":["广汽传祺祺杰店","广汽传祺兴和店","广汽传祺庞大祺广店"],"张家口市":["广汽传祺路丰汇鑫店"]},"山东":{"淄博市":["广汽传祺淄博轿辰新隆店"]},"安徽":{"黄山市":["广汽传祺骏瑞店"],"六安市":["广汽传祺六安晟鑫店"]},"福建":{"福州市":["广汽传祺福州瑞骐店"]},"江苏":{"连云港市":["广汽传祺连云港俊祺店"],"如皋市":["广汽传祺如皋益昌大生店"],"南京市":["广汽传祺南京双诚店"],"徐州市":["广汽传祺徐州美盈店"],"宿迁市":["广汽传祺沭阳天泓欣泰店"]},"浙江":{"温岭市":["广汽传祺温岭锦华店"],"台州市":["广汽传祺台州海川店"]},"广东":{"四会市":["广汽传祺四会广万利店"],"珠海市":["广汽传祺珠海悦祺店"],"江门市":["广汽传祺江门合祺店"],"汕尾市":["广汽传祺汕尾信德行店"]},"广西":{"桂林市":["广汽传祺桂林祺辰店"]},"海南":{"三亚市":["广汽传祺三亚高祺店"]},"河南":{"洛阳市":["广汽传祺保行店"],"平顶山市":["广汽传祺明行店","广汽传祺明锋店"],"三门峡市":["广汽传祺君奇店"],"驻马店市":["广汽传祺祥瑞店","广汽传祺骏富店"],"焦作市":["广汽传祺焦作优驰店"]},"湖北":{"荆州市":["广汽传祺荆州瑞之泽店"],"武汉市":["广汽传祺鸿康明店"]},"湖南":{"常德市":["广汽传祺天宝店"],"张家界市":["广汽传祺世茂店"],"永州市":["广汽传祺帝旺店"],"株洲市":["广汽传祺株洲安迅店"]},"江西":{"吉安市":["广汽传祺鑫祺店"],"萍乡市":["广汽传祺国力店"],"新余市":["广汽传祺新余广琪店"]},"甘肃":{"张掖市":["广汽传祺华逸店"],"平凉市":["广汽时代红星店"],"天水市":["广汽传祺祺盛达店"],"兰州市":["广汽传祺兰州深港店"]},"宁夏":{"吴忠市":["广汽传祺吴忠恒信店"],"石嘴山市":["广汽传祺石嘴山恒信店"]},"陕西":{"西安市":["广汽传祺西安锦淇店"],"榆林市":["广汽传祺榆林新白云店"],"延安市":["广汽传祺延安汇能店"]},"新疆":{"库尔勒":["广汽传祺海利昕祺店"],"伊犁哈萨克自治州":["广汽传祺奎屯华科店"],"哈密市":["广汽传祺哈密广骏店"]},"贵州":{"毕节市":["广汽传祺佰润正和"]},"四川":{"凉山州市":["广汽传祺凯达店"],"乐山市":["广汽传祺西部店"],"巴中市":[""],"绵阳市":["广汽传祺绵阳泰康店"],"眉山市":["广汽传祺眉山华信恒驰店"],"攀枝花市":["广汽传祺攀枝花长禧店"],"自贡市":["广汽传祺自贡中盛天翔店"],"彭州市":["广汽传祺彭州信祺店"],"雅安市":["广汽传祺雅安中盛晶品店"]},"云南":{"普洱市":["广汽传祺祺鑫店"],"西双版纳傣族自治州":["广汽传祺昌达店","广汽传祺西双版纳昌达店"],"文山市":["广汽传祺骏驰店"],"昆明市":["广汽传祺昆明安飞店"]}}
var config = {
    // 'url': '/default/getdata',
    'data': where,
    'select': [
        {'id': 'pro', 'text': '请选择省份', 'value': '请选择省份'},	//省
        {'id': 'city', 'text': '请选择城市','value': '请选择城市'},			//市
        {'id': 'dealer', 'text': '请选择经销商','value': '请选择经销商'}				//code
    ]
};
var linkage = function(config,prefix){
    //设置select默认选项
    function setDefault(obj, text, value) {
        obj.options[0] = new Option(text, value);
    }
    //设置select选项
    function setOption(obj, text, value) {
        obj.options[obj.options.length] = new Option(text, value);
    }
    //重置select选项
    function resetOptions(id) {
        var obj = document.getElementById(id);
        while (obj.options.length > 1) {
            obj.remove(1);
        }
    }
    //获取选中的值
    function getSelectValue(id) {
        var obj = document.getElementById(id);

        return obj.options[obj.selectedIndex].value;
    }
    //设置onchange事件
    function setChange(obj, data, i) {
        addEvent(obj, 'change', function(){
            //重置本级以后所有的select
            for (var j = i+1; j < config.select.length; j++) {
                resetOptions(config.select[j].id);
            }
            //如果当前不是默认选项，设置下一级的相应选项
            var v = config.select[i].value ? config.select[i].value : '';
            if (this.value != v) {
                var next_obj = document.getElementById(config.select[i+1].id);
                var next_data = data;
                for (var x = 0; x <= i; x++) {
                    var index = getSelectValue(config.select[x].id);
                    next_data = next_data[index];
                }
                for (var d in next_data) {
                    //next_data可能是数组也可能是object
                    var k = next_data.length ? next_data[d] : d;
                    setOption(next_obj, k, k);
                }
            }
        });
    }
    var _addEventArr = new Array();
    function addEvent(d, c, b) {
        var a = d;
        if (typeof(d) == "string") {
            d = document.getElementById(d)
        } else {
            a = d.id
        }
        if (_addEventArr[a] == 1) {
            return
        } else {
            _addEventArr[a] = 1
        }
        if (d.addEventListener) {
            d.addEventListener(c, b, false)
        } else {
            if (d.attachEvent) {
                d.attachEvent("on" + c, function() {
                    return b.apply(d, new Array(window.event))
                })
            }
        }
    }
    //初始化
    function init(data) {
        for (var i in config.select) {
//      	config.select[i].id = prefix + config.select[i].id
            var item = config.select[i];
            var obj = document.getElementById(item.id);
            var text = item.text ? item.text : '请选择';
            var value = item.value ? item.value : '';
            //设置默认选项
            setDefault(obj, text, value);
            //为第一级设置选项
            if (i == 0) {
                for (var d in data) {
                    setOption(obj, d, d);
                }
            }
            //除了最后一级，设置onchange事件
            if (i < config.select.length - 1) {
                setChange(obj, data, parseInt(i));
            }
        }
    };
    if (config.data) {
        init(config.data);
    } else if (config.url) {
        loader('ajax/ajax', function(){
            $.ajax.getJSON(config.url, function(data){
                init(data);
            });
        });
    } else {
        alert('linkage has no data or url');
    }
};
