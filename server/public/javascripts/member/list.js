var member_list = function () {
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

        $("#dev_table_info").on("click", ".btnMember4Coupon",function () {
            var memberId = $(this).attr('data-val');
            var _arg = {memberId: memberId};
            _self.getMemberCouponList(_arg).done(function(coupons) {
                $('#couponDetail_Modal').modal();
                $('#memberCouponList').empty();
                var _length  = coupons.length;
                for(var i = 0; i <  _length; i ++) {
                    var _tr = $('<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>');
                    _tr.find('td:eq(0)').html(i+1);
                    _tr.find('td:eq(1)').html(coupons[i]['CouponTitle']);
                    _tr.find('td:eq(2)').html(coupons[i]['CouponPar']);
                    _tr.find('td:eq(3)').html(coupons[i]['MinPar']);
                    _tr.find('td:eq(4)').html(DateFormater.format(new Date(coupons[i]['ExpireDate']), "yyyy-MM-dd"));
                    _tr.find('td:eq(5)').html(coupons[i]['UsedInfo'] +','+ coupons[i]['ExpireInfo']);
                    _tr.find('td:eq(6)').html(coupons[i]['GetCouponTime'].replace("T", " ").replace(".000Z", ""));

                    if(coupons[i]['UsedInfo'] == '未使用') {
                        _tr.css('color', '#FF6600');
                    } else {
                        _tr.css('color', '#c0c0c0');
                    }

                    if(coupons[i]['ExpireInfo'] == '未过期') {
                        _tr.css('font-weight', 'bold');
                    } else {
                        _tr.css('color', '#c0c0c0');
                    }

                    $('#memberCouponList').append(_tr);
                }
            });

        });
    };



    _self.getAndShowMember = function (pageIndex) {
        _self.currentPage = pageIndex;
        _self.getMemberList({page: pageIndex, keyword: $('#dev_member_search').val()}).done(function (json) {
            var totalPageNum = Math.ceil(parseInt(json.total) / AppConfig.PAGING_CONFIG.pageSize);
            PagingControl.updatePagingControl(totalPageNum, _self.currentPage);
            _self.showMemberList(json.members);
        });
    };

    _self.showMemberList = function (members) {
        $('#dev_table_info').empty();
        var _length = members.length;
        for(var i = 0; i <  _length; i ++) {
            var tr = $('<tr>' +
            '<td>' + ((_self.currentPage - 1) * AppConfig.PAGING_CONFIG.pageSize + i + 1) + '</td>' +
            '<td>' + members[i].MemberAccount + '</td>' +
            '<td>' + members[i].MemberState + '</td>' +
            '<td>' + members[i].CreateTime.replace("T", " ").replace(".000Z", "") + '</td>' +
            '<td style="text-align: center;">' +
                '<a href="/member/detail?userId='+members[i].Id+'" class="btn mini btnMemberDtl" style="margin: auto 5px;" data-val="">查看</a>' +
                '<a href="/member/edit?userId='+members[i].Id+'" class="btn mini btnMemberUp" style="margin: auto 5px;" data-val="">修改</a>' +
                '<a href="/member/cpwd?userId='+members[i].Id+'&account='+members[i].MemberAccount+'" class="btn mini btnMemberUp" style="margin: auto 5px;" data-val="">重置密码</a>' +
                '<a href="javascript:void(0);" class="btn mini btnMemberDel" style="margin: auto 5px;" data-val="">删除</a>' +
            '</td>' +
            '</tr>');
            tr.find('.btnMemberDel').attr('data-val',  members[i].Id);
            $('#dev_table_info').append(tr);
        }
    };

    _self.getMemberList = function (args) {
        var def = $.Deferred();
        $.ajax({
            url: '/member/list',
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