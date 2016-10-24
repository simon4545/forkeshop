/**
 * Created by zlongxiao@126.com on 2015/11/5.
 */

window.goods = window.goods || {};
$(function () {
    goods.addAndEdit.init();
    //初始化表格控件

    if (pageType == "edit") {
        goods.edit.init();
    } else {
        goods.add.init();
    }
});

//商品编辑
goods.edit = {

    _curGroupId: "",
    /**
     * 初始化
     */
    init: function () {
        goods.edit._curGroupId = common.QueryString('goodsGroupId');
        goods.addAndEdit.skus._skusShow();
        goods.edit.getCategoryInfo();
        //保存
        $("#btnConfirm_edit").on('click', function () {
            goods.edit.saveInfo();
        });
        //保存并提交审核
        $("#btnSubmitCheck_edit").on('click', function () {
            var queryTaoBaoGoodsId = common.QueryString('queryTaoBaoGoodsId');
            if (queryTaoBaoGoodsId == null) {
                goods.edit.saveAndCommit();
            } else {
                goods.add.saveAadCommitTaobaoSku();
            }
        });
        //检查商家是否审核通过
        goods.addAndEdit.checkMerchantInfo();
    },
    divHide1: function (divId) {
        $('#' + divId).hide();
    },
    /**
     * 获取商品分类信息
     */
    getCategoryInfo: function () {
        var url = '/goods/category';
        common.ajax(url, "", goods.edit._getCategorySuc, goods.edit._error);
    },
    /**
     * 获取商品分类成功回调
     * @param data
     * @private
     */
    _getCategorySuc: function (data) {
        if (data.code == 200) {
            var categoryArr = data.data;
            var curId = $("#categorySelect").attr('curId');
            var arr_html = [];
            for (var i = 0; i < categoryArr.length; i++) {
                if (categoryArr[i].Id == 'd37c79275b404124b01efa2ac840b345') {
                    arr_html.push('<option disabled="disabled">-----' + categoryArr[i].categoryName + '-----</option>');
                } else if (categoryArr[i].Id == curId) {
                    arr_html.push('<option class="categoryOption" selected="selected"  value="' + categoryArr[i].Id + '">' + categoryArr[i].categoryName + '</option>');
                } else {
                    arr_html.push('<option class="categoryOption"  value="' + categoryArr[i].Id + '">' + categoryArr[i].categoryName + '</option>');
                }
            }
            $("#categorySelect").html(arr_html.join(''));
        }
    },
    _error: function () {
        layer.alert('服务异常');
    },

    /**
     * 初始化标签信息
     */
    initLabels: function () {
        try {
            var labelList = JSON.parse(labelListStr);
            for (var i = 0; i < labelList.length; i++) {
                goods.addAndEdit._labelsdb.insert(new Labels(labelList[i]));
            }
            var chooseLabels = chooseLabelsStr.split(',');
            for (var j = 0; j < chooseLabels.length; j++) {
                goods.addAndEdit._labelsdb({label: chooseLabels[j]}).update({checked: true});
            }
        } catch (e) {
            layer.alert('数据异常');
        }
    },

    /**
     * 保存并提交审核
     */
    saveInfo: function () {
        if (!goods.addAndEdit._merchantCheck) {
            layer.alert(goods.addAndEdit._merchantCheckStr);
            return false;
        }
        if (!goods.addAndEdit._outteridPass) {
            layer.alert('商品编码有重复，请重新输入后提交！');
            return false;
        }
        var checkSku = goods.addAndEdit.commit.checkSkuRepeat();
        if (checkSku) return;
        var info = goods.addAndEdit.commit.commitInfo();
        if (info) {
            info.State = 2;
            var url = '/goodsgroup/edit/' + goods.edit._curGroupId;
            common.ajax(url, info, goods.edit._saveAndCommitSuc, goods.edit._error);
        }
    },
    /**
     * 保存成功回调
     * @param data
     * @private
     */
    _saveAndCommitSuc: function (data) {
        console.log(data);
        if (data.code == 200) {
            layer.alert(data.data);
        } else {
            layer.alert(data.data);
        }
    },
    /**
     * 提交审核
     */
    checkCommit: function () {
        if (!goods.addAndEdit._merchantCheck) {
            layer.alert(goods.addAndEdit._merchantCheckStr);
            return false;
        }
        if (!goods.addAndEdit._outteridPass) {
            layer.alert('商品编码有重复，请重新输入后提交！');
            return false;
        }
        var url = '/goods/audit/' + goods.edit._curGroupId;
        var param = {State: 2};
        common.ajax(url, param, goods.edit._saveAndCommitSuc, goods.edit._error);
    },
    /**
     * 保存并提交审核
     */
    saveAndCommit: function () {
        if (!goods.addAndEdit._merchantCheck) {
            layer.alert(goods.addAndEdit._merchantCheckStr);
            return false;
        }
        if (!goods.addAndEdit._outteridPass) {
            layer.alert('商品编码有重复，请重新输入后提交！');
            return false;
        }
        var checkSku = goods.addAndEdit.commit.checkSkuRepeat();
        if (checkSku) return;
        var info = goods.addAndEdit.commit.commitInfo();
        info.State = 2;
        var url = '/goodsgroup/saveAndCommit/' + goods.edit._curGroupId;
        common.ajax(url, info, goods.edit._saveAndCommitSuc, goods.edit._error);
    }
};

//商品添加
goods.add = {

    //初始化
    init: function () {
        goods.add.getCategoryInfo();
        //goods.add.getBrandInfo();

        $("#btnConfirm").on('click', function () {
            goods.add.commitSave();
        });
        $("#btnSubmitCheck").on('click', function () {
            goods.add.checkCommit();
        });

        //检查商家是否审核通过
        goods.addAndEdit.checkMerchantInfo();
    },

    //保存成功后的groupId
    _saveGroupId: '',

    /**
     * 添加页 初始化标签信息
     */
    initLabels: function () {
        var labelsObj = JSON.parse(labelListStr);
        for (var i = 0; i < labelsObj.length; i++) {
            goods.addAndEdit._labelsdb.insert(new Labels(labelsObj[i]));
        }
    },
    /**
     * 获取商品分类信息
     */
    getCategoryInfo: function () {
        var url = '/goods/category';
        common.ajax(url, "", goods.add._getCategorySuc, goods.add._error);
    },
    /**
     * 获取商品分类成功回调
     * @param data
     * @private
     */
    _getCategorySuc: function (data) {
        if (data.code == 200) {
            var categoryArr = data.data;
            //默认选中上衣
            var curId = 'd37c79275b404124b01efa2ac840b345';
            var arr_html = [];
            for (var i = 0; i < categoryArr.length; i++) {
                if (categoryArr[i].Id == 'd37c79275b404124b01efa2ac840b345') {
                    arr_html.push('<option disabled="disabled">-----' + categoryArr[i].categoryName + '-----</option>');
                } else if (categoryArr[i].Id == curId) {
                    arr_html.push('<option class="categoryOption" selected="selected"  value="' + categoryArr[i].Id + '">' + categoryArr[i].categoryName + '</option>');
                } else {
                    arr_html.push('<option class="categoryOption"  value="' + categoryArr[i].Id + '">' + categoryArr[i].categoryName + '</option>');
                }
            }
            $("#categorySelect").html(arr_html.join(''));
        }
    },
    _error: function () {
        layer.alert('服务异常');
    },

    /**
     * 保存提交
     */
    commitSave: function () {
        if (!goods.addAndEdit._outteridPass) {
            layer.alert('商品编码有重复，请重新输入后提交！');
            return false;
        }
        if (!goods.addAndEdit._merchantCheck) {
            layer.alert(goods.addAndEdit._merchantCheckStr);
            return false;
        }
        var checkSku = goods.addAndEdit.commit.checkSkuRepeat();
        if (checkSku) return;
        var info = goods.addAndEdit.commit.commitInfo();
        var url = '';
        if (info) {
            if (goods.add._saveGroupId) {
                url = '/goodsgroup/edit/' + goods.add._saveGroupId;
                common.ajax(url, info, goods.add._commitUpdateSuc, goods.add._error);
            } else {
                url = '/goodsgroup/create';
                common.ajax(url, info, goods.add._commitSaveSuc, goods.add._error);
            }
        }
    },
    /**
     * 保存提交成功回调
     * @param data
     * @private
     */
    _commitSaveSuc: function (data) {
        if (data.code == '200') {
            goods.add._saveGroupId = data.data;
            var queryTaoBaoGoodsId = common.QueryString('queryTaoBaoGoodsId');
            if (queryTaoBaoGoodsId != null) {
                layer.alert('保存成功', {closeBtn: false}, function () {
                    window.location.href = '/goods/edit?goodsGroupId=' + goods.add._saveGroupId;
                });
            } else {
                //保存成功后得到groupId 信息
                layer.alert('保存成功',function(){
                    window.location.href ='/goods/list';
                });
            }

        } else {
            layer.alert(data.data);
        }
    },
    /**
     * 更新提交成回调
     * @param data
     * @private
     */
    _commitUpdateSuc: function (data) {
        layer.alert(data.data);
    },
    checkCommit: function () {
        if (!goods.addAndEdit._merchantCheck) {
            layer.alert(goods.addAndEdit._merchantCheckStr);
            return false;
        }
        if (goods.add._saveGroupId) {
            var url = '/goods/audit/' + goods.add._saveGroupId;
            var param = {State: 2};
            common.ajax(url, param, goods.add._commitUpdateSuc, goods.add._error);
        } else {
            layer.alert('请先保存');
        }
    },

    /**
     *淘宝sku 保存并提交审核
     */
    saveAadCommitTaobaoSku: function () {
        if (!goods.addAndEdit._merchantCheck) {
            layer.alert(goods.addAndEdit._merchantCheckStr);
            return false;
        }
        if (goods.add._saveGroupId) {
            var checkSku = goods.addAndEdit.commit.checkSkuRepeat();
            if (checkSku) return;
            var info = goods.addAndEdit.commit.commitInfo();
            info.State = 2;
            info.id = goods.add._saveGroupId;
            var url = '/goodsgroup/saveAndCommit/' + goods.add._saveGroupId;
            common.ajax(url, info, goods.add._commitUpdateSuc, goods.add._error);
        } else {
            layer.alert('请先保存');
        }
    }
};

//商品添加和编辑公用部分
goods.addAndEdit = {
    _skudb: TAFFY(),
    //标签数据
    _labelsdb: TAFFY(),
    //outerid是否重复标识
    _outteridPass: true,
    //检查商家是否审核通过
    _merchantCheck: true,
    _merchantCheckStr: '您的基本信息审核未通过，请联系福克商城运营审核，感谢您的配合',

    init: function () {
        goods.addAndEdit.skus.universalTable();
        goods.addAndEdit.skus.init();
        //初始化编辑器
        $('#summernote_edit').summernote({
            height: 500,
            lang: 'zh-CN'
        });
        goods.addAndEdit.tagInfo();
        goods.addAndEdit.skus._skusShow();
        //商品编码重复检测
        goods.addAndEdit.checkOuteriid();
        //商品编码重复检测
        $("#outerIdInput_edit").blur(function () {
            goods.addAndEdit.checkOuteriid();
        });
        //添加颜色规则
        $("#btnAddColor").on('click', function () {
            goods.addAndEdit.addConfig(this, "colorCheck");
            //添加事件绑定
            $(".colorCheck").off('click');
            $(".colorCheck").on('click', function () {
                goods.addAndEdit.skus.colorChoose(this);
            });
        });
        //添加尺码规则
        $("#btnAddSize").on('click', function () {
            goods.addAndEdit.addConfig(this, 'sizeCheck');
            //添加事件绑定
            $(".sizeCheck").off('click');
            $(".sizeCheck").on('click', function () {
                goods.addAndEdit.skus.sizeChoose(this);
            });
        });

        //颜色选择
        $(".colorCheck").on('click', function () {
            goods.addAndEdit.skus.colorChoose(this);
        });
        //尺码选择
        $(".sizeCheck").on('click', function () {
            goods.addAndEdit.skus.sizeChoose(this);
        });

        //图片上传
        $("#inputFile_groupImg").on('change', function () {
            goods.addAndEdit.uploadFile('formUploadGroupImg', goods.addAndEdit._uploadFileSuc, '#inputFile_groupImg');
        });

        //商品标签点击
        $(".dev_label").on('click', function () {
            goods.addAndEdit.labelClick(this);
        });
        goods.addAndEdit.draggleImageChange();

    },
    _error: function () {
        layer.alert('服务异常');
    },
    /**
     * 检测outeriid 是否重复
     *
     */
    checkOuteriid: function () {
        var outerObj = $("#outerIdInput_edit");
        var curid = outerObj.attr("curid");
        var inputOuteriid = outerObj.val();
        if (inputOuteriid != curid && inputOuteriid) {
            var url = '/goods/checkOuteriid';
            var param = {outeriid: inputOuteriid};
            common.ajax(url, param, goods.addAndEdit._checkOuterSuc, goods.addAndEdit._error);
        }
    },
    _checkOuterSuc: function (data) {
        if (data.code != 200) {
            layer.alert(data.msg);
            goods.addAndEdit._outteridPass = false;
        } else {
            goods.addAndEdit._outteridPass = true;
        }
    },

    /**
     * 标签点击事件
     * @param $obj
     */
    labelClick: function ($obj) {
        var labelName = $($obj).attr("values");
        if ($($obj).attr('checked')) {
            goods.addAndEdit._labelsdb({label: labelName}).update({checked: true});
        } else {
            goods.addAndEdit._labelsdb({label: labelName}).update({checked: false});
        }
    },
    //适用人群
    tag: [{value: 0, text: "无性别区分"}, {value: 1, text: "男童"}, {value: 2, text: "女童"}],
    /**
     *适用人群展示
     */
    tagInfo: function () {
        var arr_html = [];
        var tagObj = $("#targetPerson");
        var curId = tagObj.attr('curid');
        for (var i = 0; i < goods.addAndEdit.tag.length; i++) {
            if (goods.addAndEdit.tag[i].value == curId) {
                arr_html.push('<label class="radio"><input type="radio" name="optionsRadios_sex" value="' + goods.addAndEdit.tag[i].value + '" checked/>' + goods.addAndEdit.tag[i].text + '</label>');
            } else {
                arr_html.push('<label class="radio"><input type="radio" name="optionsRadios_sex" value="' + goods.addAndEdit.tag[i].value + '" />' + goods.addAndEdit.tag[i].text + '</label>');
            }
        }
        tagObj.html(arr_html.join(''));
    },
    /**
     * 添加颜色配置
     * @param $obj
     */
    addConfig: function ($obj, type) {
        var arr_html = [];
        arr_html.push('<label class="checkbox">');
        arr_html.push('<input class="' + type + '" type="checkbox"/>');
        arr_html.push('<span style="display: inline-block;background-color: rgba(0,0,0,0)' + ';margin-top: 3px;width: 16px;height: 16px;position: absolute;"></span>');
        if (type == "colorCheck") {
            arr_html.push('<input type="text" class="ruleInput colorInput" value="" oldvalue="" onblur="goods.addAndEdit.skus.changeColor(this)">');
        } else {
            arr_html.push('<input type="text" class="ruleInput colorInput" value="" oldvalue="" onblur="goods.addAndEdit.skus.changeSize(this)">');
        }
        arr_html.push('</label>');
        $($obj).before(arr_html.join(""));
    },

    uploadFile: function (formId, suc, objId) {
        var loadId = layer.load();
        var allSmallerThan200kb = true;
        var allLargerThan50kb = true;
        var filesObj = $(objId)[0].files;
        for (var attr in filesObj) {
            var size = filesObj[attr].size;
            if (size > 205000) {
                allSmallerThan200kb = false;
            }
            if (size < 52000) {
                allLargerThan50kb = false;
            }
        }
        if (!allSmallerThan200kb || !allLargerThan50kb) {
            layer.close(loadId);
            layer.alert("上传的图片中，有图片大于200KB或小于50KB，请修改后重新上传。");
            return;
        }
        //上传
        uploadFile(formId, suc, loadId);
    },
    _uploadFileSuc: function (data, loadId) {
        if (200 === data.code) {
            var fileUrlArr = data.msg;
            //console.log(fileUrlArr);
            var arr_html = [];
            for (var i = 0; i < fileUrlArr.length; i++) {
                arr_html.push('<div style="width: 200px;float: left;margin-top:5px;"><img src="' + fileUrlArr[i] + '" class="img_thumbnail" style="width: 150px;height:150px;display: inline-block">');
                arr_html.push('<a href="javascript:;" class="btn icn-only deleteThumb" onclick="$(this).parent().remove();goods.addAndEdit.draggleImageChange();"><i class="icon-remove"></i></a>');
                arr_html.push('<a href="' + fileUrlArr[i] + '" download="' + fileUrlArr[i] + '" class="btn icn-only downloadFile"><i class="icon-arrow-down"></i></a></div>')
            }
            $("#img_thumbnailDiv").append(arr_html.join(''));
            //先移除属性 在添加属性
            goods.addAndEdit.draggleImageChange();
            layer.close(loadId);
            layer.alert('上传成功');

        } else {
            layer.alert(data.msg);
        }
    },

    /**
     * 先移除图片的属性，再添加属性
     */
    draggleImageChange: function () {
        var count = 0;
        $("#img_thumbnailDiv div").each(function (idx) {
            count++;
            $(this).removeAttr('style').css({
                'width': '200px',
                'float': 'left',
                'margin-top': '5px',
                'margin-left': '10px;'
            });
            //去除父级元素的事件
            $(this).unbind();
        });


        setTimeout(function () {
            //初始化移动属性
            draggleMove('img_thumbnailDiv');
            //计算父元素的高度
            var par_obj = $("#thumbContainer_edit");
            var par_width = par_obj.width();
            //每行能放下的个数
            var col = Math.floor(par_width / 200);
            //总共能放的行数
            var tol_col_count = Math.ceil(count / col);
            par_obj.css('height', tol_col_count * 180 + "px");
            par_obj.css('height', tol_col_count * 180 + "px");
        }, 0);
    },
    //检查商家是否审核通过
    checkMerchantInfo: function () {
        var url = '/goods/checkMerchantInfo';
        common.ajax(url, '', goods.addAndEdit._checkMerchantSuc, goods.add._error);
    },
    _checkMerchantSuc: function (data) {
        if (data.code == '200') {
            goods.addAndEdit._merchantCheck = true;
        } else {
            goods.addAndEdit._merchantCheck = false;
            layer.alert(goods.addAndEdit._merchantCheckStr);
        }
    },

    //子商品信息
    skus: {

        _colorList: new TAFFY(),
        _sizeList: new TAFFY(),
        _table: undefined,
        universalTable: function () {
            var maxCountEditable = false;
            if (pageType == 'add') {
                maxCountEditable = true;
            }
            goods.addAndEdit.skus._table = new NCTable(
                {
                    cols: [
                        {title: '编号', alias: 'id', visible: false, editable: false},
                        {title: '规则', alias: 'FilterConfig', visible: true, editable: false},
                        {title: '商品SKU', alias: 'Skuid', visible: true, editable: true},
                        {title: '售价', alias: 'GoodsSalePrice', type: 'number', visible: false, editable: false},
                        {title: '供货价', alias: 'GoodsSupplyPrice', type: 'number', visible: true, editable: true},
                        {title: '库存', alias: 'MaxCount', type: 'number', visible: true, editable: maxCountEditable}
                    ],
                    container: '#infoContainer',
                    headerClassName: '',
                    itemClassName: '',
                    className: '',
                    op: true,
                    id: 'test',
                    onDeleteItem: function (id) {
                        goods.addAndEdit.skus.deleteSku(id);
                    },
                    onUpdateItem: function (id, key, value) {
                        switch (key) {
                            case 'Skuid':
                                goods.addAndEdit.skus.updateSku(id, value);
                                break;
                            case 'GoodsSupplyPrice':
                                goods.addAndEdit.skus.updatePrice(id, value);
                                break;
                            case 'MaxCount':
                                goods.addAndEdit.skus.updateMaxCount(id, value);
                                break;
                        }
                    }
                }
            );
        },
        init: function () {
            this.initSizeAndColor();
            this._initSku();
            goods.addAndEdit.skus._skusShow();

            $('#btnMainPre').click(function () {
                var _htm = $('#summernote_edit').code().replace(/<p><br><\/p>/ig, '').replace(/<br>/ig, '').replace(/(style|width|height|class)=\".*?\"/ig, '');
                $('#m_div_detail').html(_htm);
                $("#div_main_detail_m").show();
            });
        },
        initSizeAndColor: function () {
            if (pageType == 'add') {
                var colorListArr = eval('(' + colorList + ")");
                var len_color = colorListArr.length;
                for (var i = 0; i < len_color; i++) {
                    var _color = new Color(colorListArr[i].color, false, colorListArr[i].rgba);
                    goods.addAndEdit.skus._colorList.insert(_color);
                }
                var sizeListArr = eval("(" + sizeList + ")");
                var len_size = sizeListArr.length;
                for (var j = 0; j < len_size; j++) {
                    var _size = new Size(sizeListArr[j], false);
                    goods.addAndEdit.skus._sizeList.insert(_size);
                }

            } else {
                var _colorList = colorList.split(',');
                var len_color = _colorList.length;
                for (var i = 0; i < len_color; i++) {
                    var _color = new Color(_colorList[i], true);
                    goods.addAndEdit.skus._colorList.insert(_color);
                }
                var _sizeList = sizeList.split(',');
                var len_size = _sizeList.length;
                for (var j = 0; j < len_size; j++) {
                    var _size = new Size(_sizeList[j], true);
                    goods.addAndEdit.skus._sizeList.insert(_size);
                }
            }
        },
        _initSku: function () {
            var changeFlag = true;
            if (pageType == "edit") {
                changeFlag = false;
            }
            for (var i = 0; i < skuListObj.length; i++) {
                var sku = new Sku(skuListObj[i].color, skuListObj[i].size, skuListObj[i].Id, skuListObj[i].Skuid,
                    skuListObj[i].GoodsSupplyPrice, skuListObj[i].MaxCount, skuListObj[i].GoodsSalePrice, changeFlag);
                goods.addAndEdit._skudb.insert(sku);
            }
        },
        /**
         * 颜色选择
         * @param $obj
         */
        colorChoose: function ($obj) {
            var color = $($obj).attr("values");
            var addColor = $($($obj).parent().children('input')[1]).val();
            if ($($obj).attr("checked")) {
                if (!addColor) {
                    $($obj).attr("checked", false);
                    layer.alert('有重复的颜色规则，请重新输入');
                }
                if (goods.addAndEdit.skus._colorList({color: addColor, checked: true}).count() > 0) {
                    $($obj).attr("checked", false);
                    layer.alert('有重复的颜色规则，请重新输入');
                } else {
                    if (goods.addAndEdit.skus._colorList({color: addColor}).count() == 0) {
                        goods.addAndEdit.skus._colorList.insert(new Color(addColor, true));
                    } else {
                        goods.addAndEdit.skus._colorList({color: addColor}).update({checked: true});
                    }

                    //生成新的skus
                    for (var i = 0; i < goods.addAndEdit.skus._sizeList({checked: true}).count(); i++) {
                        if (addColor) {
                            var _size = goods.addAndEdit.skus._sizeList({checked: true}).get()[i].size;
                            var insertInfo = new Sku(addColor, _size);
                            goods.addAndEdit._skudb.insert(insertInfo);
                        }
                    }
                }
            } else {
                //移除数组中的颜色
                goods.addAndEdit.skus._colorList({color: addColor}).remove();
                goods.addAndEdit._skudb({color: color}).remove();
                goods.addAndEdit._skudb({color: addColor}).remove();
            }
            goods.addAndEdit.skus._skusShow();
        },
        /**
         * 尺码选择
         * @param $obj
         */
        sizeChoose: function ($obj) {
            var size = $($obj).attr("values");
            var addSize = $($($obj).parent().children('input')[1]).val();
            if ($($obj).attr("checked")) {
                if (!addSize) {
                    $($obj).attr("checked", false);
                    layer.alert('有重复的尺码规则，请重新输入');
                }
                if (goods.addAndEdit.skus._sizeList({size: addSize, checked: true}).count() > 0) {
                    $($obj).attr("checked", false);
                    layer.alert('有重复的尺码规则，请重新输入');
                } else {
                    if (goods.addAndEdit.skus._sizeList({size: addSize}).count() == 0) {
                        goods.addAndEdit.skus._sizeList.insert(new Size(addSize, true));
                    } else {
                        goods.addAndEdit.skus._sizeList({size: addSize}).update({checked: true});
                    }

                    //生成新的skus
                    for (var i = 0; i < goods.addAndEdit.skus._colorList({checked: true}).count(); i++) {
                        if (addSize) {
                            var _color = goods.addAndEdit.skus._colorList({checked: true}).get()[i].color;
                            var insertInfo = new Sku(_color, addSize);
                            goods.addAndEdit._skudb.insert(insertInfo);
                        }
                    }
                }
            } else {
                //移除数组中的尺码
                goods.addAndEdit.skus._sizeList({size: addSize}).remove();
                goods.addAndEdit._skudb({size: size}).remove();
                goods.addAndEdit._skudb({size: addSize}).remove();
            }
            goods.addAndEdit.skus._skusShow();
        },
        /**
         * 添加子商品的展示
         * @private
         */
        _skusShow: function () {
            var data = goods.addAndEdit._skudb().get();
            goods.addAndEdit.skus._table.refresh(data);
            //$("#list_childrenTBody").html(html);
        },
        /**
         * 颜色变化修改
         * @param $obj
         */
        changeColor: function ($obj) {
            var old = $($obj).attr('oldvalue');
            var cur = $.trim($($obj).val());

            //是否选中
            var choosed = $($($obj).parent().children('input')).attr("checked");
            if (old != cur && choosed) {
                //检查重复
                if (goods.addAndEdit.skus._colorList({color: cur}).count() > 0) {
                    layer.alert('颜色重复');
                    $($obj).val(old);
                    return;
                }
                goods.addAndEdit.skus._colorList({color: old}).remove();
                goods.addAndEdit.skus._colorList.insert(new Color(cur, true));
                goods.addAndEdit._skudb({color: old}).update({color: cur});
                goods.addAndEdit.skus._changeFileterConfig(cur, 'color');
                goods.addAndEdit.skus._skusShow();
            }
            $($obj).attr('oldvalue', cur);
        },
        /**
         * 尺寸变化修改
         * @param $obj
         */
        changeSize: function ($obj) {
            var old = $($obj).attr('oldvalue');
            var cur = $.trim($($obj).val());

            //是否选中
            var choosed = $($($obj).parent().children('input')).attr("checked");
            if (old != cur && choosed) {
                //检测是否重复
                if (goods.addAndEdit.skus._sizeList({size: cur}).count() > 0) {
                    layer.alert('尺码重复');
                    $($obj).val(old);
                    return;
                }
                goods.addAndEdit.skus._sizeList({size: old}).remove();
                goods.addAndEdit.skus._sizeList.insert(new Size(cur, true));
                goods.addAndEdit._skudb({size: old}).update({size: cur});
                goods.addAndEdit.skus._changeFileterConfig(cur, 'size');
                goods.addAndEdit.skus._skusShow();
            }
            $($obj).attr('oldvalue', cur);
        },

        /**
         *修改filterConfig 的内容
         * @param value  修改的值
         * @param type   颜色或尺码
         * @private
         */
        _changeFileterConfig: function (value, type) {
            var oldConfig, newConfig, len = 0;
            if (type == 'color') {
                oldConfig = goods.addAndEdit._skudb({color: value}).get();
                len = goods.addAndEdit._skudb({color: value}).count();
                for (var i = 0; i < len; i++) {
                    var _oldConfig = oldConfig[i].FilterConfig.split(',');
                    var _newConfig = value + "," + _oldConfig[1];
                    goods.addAndEdit._skudb({
                        color: value,
                        FilterConfig: oldConfig[i].FilterConfig
                    }).update({FilterConfig: _newConfig});
                }
            } else {
                oldConfig = goods.addAndEdit._skudb({size: value}).get();
                len = goods.addAndEdit._skudb({size: value}).count();
                for (var j = 0; j < len; j++) {
                    var _oldConfig = oldConfig[j].FilterConfig.split(',');
                    var _newConfig = _oldConfig[0] + "," + value;
                    goods.addAndEdit._skudb({
                        size: value,
                        FilterConfig: oldConfig[j].FilterConfig
                    }).update({FilterConfig: _newConfig});
                }
            }
        },

        /**
         * 更新sku
         * @param id
         * @param value
         * @param $obj
         */
        updateSku: function (id, value, $obj) {
            if ($($obj).attr('oldValue') == value) {
                return;
            }
            //if (goods.addAndEdit._skudb({Skuid: value}).count() == 0) {
            goods.addAndEdit._skudb({id: id}).update({Skuid: value, changeFlag: true});
            // }
        },
        /**
         * 更新价格
         * @param id
         * @param value
         */
        updatePrice: function (id, value) {
            goods.addAndEdit._skudb({id: id}).update({GoodsSupplyPrice: value, changeFlag: true});
        },
        /**
         * 更新库存
         * @param id
         * @param value
         */
        updateMaxCount: function (id, value) {
            goods.addAndEdit._skudb({id: id}).update({MaxCount: value});
        },
        /**
         * 删除
         * @param id
         */
        deleteSku: function (id) {
            goods.addAndEdit._skudb({id: id}).remove();
            goods.addAndEdit.skus._skusShow();
            goods.addAndEdit._skudb().update({changeFlag: true});
        }
    },
    //数据提交
    commit: {
        /**
         * 检查input标签是否都填写了信息
         * @returns {boolean}
         */
        checkInput: function () {
            var pass = true;
            $("input").each(function () {
                if (!$(this).val() && $(this).attr("required")) {
                    $(this).siblings(".help-inline").show();
                    pass = false;
                    layer.alert("请将信息填写完整后再提交。");
                    return pass;
                } else {
                    $(this).siblings(".help-inline").hide();
                }
            });
            if (!parseFloat($("#priceInput_edit").val())) {
                layer.alert("请正确填写吊牌价");
                pass = false;
                return pass;
            }
            return pass;
        },
        /**
         * 获取需要提交的信息
         * @returns {*}
         */
        commitInfo: function () {
            var checkInputs = this.checkInput();
            if (!checkInputs) {
                return false;
            }
            if (!goods.addAndEdit._outteridPass) {
                layer.alert('商品编码有重复，请重新输入后提交！');
                return false;
            }
            var goodsGroup = {};
            goodsGroup.id = common.QueryString('goodsGroupId');
            if (pageType == 'add') {
                goodsGroup.id = goods.add._saveGroupId;
            }
            goodsGroup.category = {};
            goodsGroup.category.Id = $("#categorySelect").find("option:selected").val();

            goodsGroup.goodsGroupTitle = $("#goodsGroupTitleInput_edit").val();
            goodsGroup.outerId = $("#outerIdInput_edit").val();
            goodsGroup.price = parseFloat($("#priceInput_edit").val());
            goodsGroup.tag = parseInt($('#targetPerson input[name="optionsRadios_sex"]:checked ').val());

            goodsGroup.saleState = parseInt($('#publishState input[name="saleState"]:checked ').val());
            goodsGroup.goodsDetail = $('#summernote_edit').code().replace(/<p><br><\/p>/ig, '').replace(/<br>/ig, '');
            //快递费用
            goodsGroup.express_fee = $("#expressFeeInput").val();
            //处理sku 信息
            goodsGroup.sku = goods.addAndEdit.commit.dealSku(goodsGroup.outerId);
            if (goodsGroup.sku.length < 1) {
                layer.alert("请设定商品规则。");
                return false;
            }
            //检查sku 是否有空值
            if (goods.addAndEdit._skudb({Skuid: ""}).count() > 0) {
                layer.alert('商品sku 有空值，请检查');
                return false;
            }
            //尺码和颜色检测
            if (goods.addAndEdit.skus._colorList({checked: true, color: ""}).count() > 0) {
                layer.alert('选择的颜色未填写具体内容项，请检查后再重新提交');
                goods.addAndEdit.skus._colorList({checked: true, color: ""}).update({checked: false});
                return false;
            }
            if (goods.addAndEdit.skus._sizeList({checked: true, size: ""}).count() > 0) {
                layer.alert('选择的尺码有未填写具体内容项，请检查后再重新提交');
                goods.addAndEdit.skus._sizeList({checked: true, size: ""}).update({checked: false});
                return false;
            }

            //处理图片顺序
            var imgPaths = goods.addAndEdit.commit.getImgList();
            if (!imgPaths) {
                return false;
            }
            goodsGroup.imgPaths = imgPaths;
            var customConfig = {colors: [], sizes: []};
            customConfig.colors = goods.addAndEdit.skus._colorList({checked: true}).get();
            customConfig.sizes = goods.addAndEdit.skus._sizeList({checked: true}).get();
            goodsGroup.customConfig = customConfig;
            //标签信息
            var labelInfo = goods.addAndEdit._labelsdb({checked: true}).get();
            var labelArr = [];
            for (var i = 0; i < labelInfo.length; i++) {
                labelArr.push(labelInfo[i].label);
            }
            goodsGroup.GoodsLabel = labelArr.join(',');
            //商品地址
            goodsGroup.GoodsLink = $("#dev_goodsLink").val();
            return goodsGroup;
        },
        /**
         * 处理sku 信息
         * @param outerId
         * @returns {Array}
         */
        dealSku: function (outerId) {
            var data = goods.addAndEdit._skudb().get();
            var len = goods.addAndEdit._skudb().count();
            var sku_list = [];
            for (var i = 0; i < len; i++) {
                var sku = {};
                sku.title = data[i].color + "," + data[i].size;
                sku.sku_id = data[i].Skuid;
                sku.outer_id = outerId;

                sku.quantity = data[i].MaxCount;
                sku.supply_price = data[i].GoodsSupplyPrice;
                //让供货价与售价相等
                //sku.sell_price = data[i].GoodsSalePrice;
                sku.sell_price = data[i].GoodsSupplyPrice;
                if (data[i].goodsId) {
                    sku.id = data[i].goodsId;
                }
                sku_list.push(sku);
            }
            return sku_list;
        },
        /**
         * 检查sku 是否有重复
         */
        checkSkuRepeat: function () {
            var data = goods.addAndEdit._skudb().get();
            var count = goods.addAndEdit._skudb().count();
            var repeat = false;
            for (var i = 0; i < count; i++) {
                if (goods.addAndEdit._skudb({Skuid: data[i].Skuid}).count() > 1) {
                    repeat = true;
                }
            }
            if (repeat) {
                layer.alert('sku 重复，请检查');
            }
            //检查sku 是否为空
            var nullSku = goods.addAndEdit._skudb({Skuid: ""}).count();
            if (nullSku > 0) {
                repeat = true;
                layer.alert('sku 有空值，请检查后重新输入');
            }
            return repeat;
        },
        getImgList: function () {
            var imgdb = TAFFY();
            var imgPaths = [];
            var count = 0;
            $("#img_thumbnailDiv div").each(function (idx) {
                count++;
                var that = $(this);
                var divObj = that.offset();
                var imgSrc = that.children('img').attr('src');
                imgdb.insert({top: divObj.top, left: divObj.left, src: imgSrc});
            });
            if (count < 1) {
                layer.alert("请上传商品图片。");
                return false;
            }
            //正序排序
            var _imgdb = imgdb().order('top asec,left asec').get();
            for (var i = 0; i < _imgdb.length; i++) {
                imgPaths.push(_imgdb[i].src);
            }
            return imgPaths;
        }
    }
};

/**
 *  Sku 基类
 * @param color
 * @param size
 * @param goodsId
 * @param sku
 * @param price
 * @param maxCount
 * @constructor
 */
function Sku(color, size, goodsId, sku, price, maxCount, salePrice, changeFlag) {
    this.FilterConfig = color + "," + size;
    this.color = color;
    this.size = size;
    this.Skuid = sku ? sku : "";
    this.GoodsSalePrice = salePrice;
    this.GoodsSupplyPrice = typeof (price) == 'undefined' ? 0 : price;
    this.MaxCount = typeof (maxCount) == 'undefined' ? 0 : maxCount;
    this.goodsId = goodsId ? goodsId : "";
    this.id = UUID.generate();
    //是否有改动
    this.changeFlag = typeof (changeFlag) == 'undefined' ? true : changeFlag;
}

/**
 * 颜色基类
 * @param color
 * @param checked
 * @param rgba
 * @constructor
 */
function Color(color, checked, rgba) {
    this.color = color;
    this.checked = checked ? checked : false;
    this.rgba = rgba ? rgba : "rgb(255, 255, 0)";
    this.id = UUID.generate();
}

/**
 * 尺码基类
 * @param size
 * @param checked
 * @constructor
 */
function Size(size, checked) {
    this.size = size;
    this.checked = checked ? checked : false;
    this.id = UUID.generate();
}

/**
 * 商品标签基类
 * @param label
 * @param checked
 * @constructor
 */
function Labels(label, checked) {
    this.label = label;
    this.checked = checked ? true : false;
}

Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};

/**
 * 图片上传
 * @param formId
 * @param suc
 * @param loadId
 */
function uploadFile(formId, suc, loadId) {
    var formData = new FormData($("#" + formId)[0]);//new FormData($("#formUploadGroupImg")[0]);
    $.ajax({
        url: AppConfig.URL.UPLOAD_TO_BDBCE,
        type: 'POST',
        data: formData,
        async: true,
        cache: false,
        contentType: false,
        processData: false,
        success: function (res) {
            suc(res, loadId);
        },
        error: function (err) {
            console.error(err, "与服务器通信发生错误。");
            layer.alert("与服务器通信发生错误。");
        }
    });
}