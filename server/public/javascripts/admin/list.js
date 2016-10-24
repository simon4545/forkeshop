var admin_list = function () {
    var _self = this;
    _self.currentPage = 1;

    _self.init = function () {
        PagingControl.init(_self.getAndShowMember);
        _self.getAndShowMember(1);
        _self.bindCommands();
    };

    _self.bindCommands = function () {
        $('#btn_search').click(function () {
            _self.getAndShowMember(1);
        });
    };



    _self.getAndShowMember = function (pageIndex) {
        _self.currentPage = pageIndex;
        _self.getMemberList({page: pageIndex, keyword: $('#dev_member_search').val()}).done(function (json) {
            var totalPageNum = Math.ceil(parseInt(json.totalSize) / AppConfig.PAGING_CONFIG.pageSize);
            PagingControl.updatePagingControl(totalPageNum, _self.currentPage);
            _self.showMemberList(json.data);
        });
    };

    _self.showMemberList = function (members) {
        $('#dev_table_info').empty();
        var _length = members.length;
        for(var i = 0; i <  _length; i ++) {
            var tr = $('<tr>' +
            '<td>' + ((_self.currentPage - 1) * AppConfig.PAGING_CONFIG.pageSize + i + 1) + '</td>' +
            '<td>' + members[i].AccountName + '</td>' +
            '<td>' + members[i].AccountState + '</td>' +
            '<td>' + members[i].CreateTime.replace("T", " ").replace(".000Z", "") + '</td>' +
            '<td><a href="javascript:void(0);" class="btn mini btnAdminDel" data-val="">删除</a>' +
            '</td>' +
            '</tr>');
            tr.find('.btnAdminDel').attr('data-val',  members[i].Id);
            $('#dev_table_info').append(tr);
        }
        _self.regEvent();
    };

    _self.regEvent=function(){
        $('.btnAdminDel').click(function(){
            //获取当前Id
            var  val = $(this).attr('data-val');
            layer.confirm('确认删除该管理员',{title:'提示'},function(){
                $.ajax({
                    url: '/admin/del',
                    type: 'POST',
                    data: JSON.stringify({id:val}),
                    dataType: "JSON",
                    contentType: 'application/json',
                    success: function (res) {
                        if (200 === res.code) {
                            layer.alert(res.msg,function(){
                                //当前页面重新加载
                                window.location.reload();
                            });
                        } else {
                            layer.alert(res.msg);
                        }
                    },
                    error: function (err) {
                        layer.alert("删除失败，请重试~", {icon: 5, title: '警告'});
                        def.resolve(null);
                    }
                });

            });
        });
    };

    _self.getMemberList = function (args) {
        var def = $.Deferred();
        $.ajax({
            url: '/admin/list',
            type: 'POST',
            data: JSON.stringify(args),
            dataType: "JSON",
            contentType: 'application/json',
            success: function (res) {
                if (200 === res.CODE) {
                    def.resolve(res.DATA);
                } else {
                    def.resolve(null);
                }
            },
            error: function (err) {
                layer.alert("查询用户失败，请重试~", {icon: 5, title: '警告'});
                def.resolve(null);
            }
        });
        return def.promise();
    };


    _self.getMemberCouponList = function (args) {
        var def = $.Deferred();
        $.ajax({
            url: '/member/coupon/list',
            type: 'POST',
            data: JSON.stringify(args),
            dataType: "JSON",
            contentType: 'application/json',
            success: function (res) {
                if (200 === res.code) {
                    def.resolve(res.data);
                } else {
                    def.resolve(null);
                }
            },
            error: function (err) {
                layer.alert("查询用户优惠券失败，请重试~", {icon: 5, title: '警告'});
                def.resolve(null);
            }
        });
        return def.promise();
    };
};