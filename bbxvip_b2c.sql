SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for bbx_account
-- ----------------------------
DROP TABLE IF EXISTS `bbx_account`;
CREATE TABLE `bbx_account` (
  `Id` int(100) NOT NULL AUTO_INCREMENT,
  `AccountName` char(50) NOT NULL,
  `AccountPass` char(50) NOT NULL,
  `CreateTime` datetime NOT NULL,
  `Role` varchar(255) DEFAULT NULL,
  `AccountState` tinyint(4) DEFAULT '1' COMMENT '1：正常，2：冻结',
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Id` (`Id`) USING BTREE,
  UNIQUE KEY `AccountName` (`AccountName`,`AccountPass`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=100284 DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

-- ----------------------------
-- Records of bbx_account
-- ----------------------------
INSERT INTO `bbx_account` VALUES ('100002', 'admin', 'admin', '2016-10-17 14:20:49', '管理员', '1');
INSERT INTO `bbx_account` VALUES ('100004', 'test1', 'test1', '2016-10-17 14:20:41', '管理员', '1');
INSERT INTO `bbx_account` VALUES ('100283', 'admDB', '1', '2016-10-19 09:19:32', '管理员', '1');

-- ----------------------------
-- Table structure for bbx_article
-- ----------------------------
DROP TABLE IF EXISTS `bbx_article`;
CREATE TABLE `bbx_article` (
  `Id` varchar(50) NOT NULL,
  `ArticleTitle` varchar(200) DEFAULT NULL COMMENT '标题',
  `ArticleSubTitle` varchar(100) DEFAULT NULL COMMENT '小标题',
  `ArticleContent` text COMMENT '内容',
  `CreateTime` datetime DEFAULT NULL COMMENT '创建时间',
  `ArticleCategoryId` varchar(50) DEFAULT NULL COMMENT '文章分类',
  `ArticleType` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

-- ----------------------------
-- Records of bbx_article
-- ----------------------------
INSERT INTO `bbx_article` VALUES ('06d784e61683407f91b7621c393e58da', '发货时间', '发货时间', '<p><span style=\"font-family: 微软雅黑, sans-serif;\"><span style=\"color:#333333; font-size:14px\"><br /></span></span></p><p><span style=\"font-family: 微软雅黑, sans-serif;\"><span style=\"color:#333333; font-size:14px\">&nbsp; &nbsp; &nbsp; &nbsp;会员下单成功后，相关专业人员在12个小时内核对会员所订购的商品、邮寄地址、款项支付等信息进行审核。审核通过后，一般在1个工作日内将包裹发出；包裹发出后，系统将配送相关信息更新至会员的帐户信息中，会员可通过主页的“我的帐号－订单管理－订单状态”查询包裹的发货情况。</span></span></p><p><span style=\"font-family: 微软雅黑, sans-serif;\"><span style=\"color:#333333;font-size:14px\">注：部分品牌直发商品发货时间需以商品详情页为准，敬请谅解！</span></span></p><br />', '2014-11-12 18:20:06', '5d0cc784c3ec452b96edb88687bc4ba3', '0');
INSERT INTO `bbx_article` VALUES ('2357a11849494b7ebc48dc99cdc0ba86', '配送范围', '配送范围', '<p><span style=\"font-family:\'微软雅黑\',\'sans-serif\';\"><strong><span style=\"font-size:16px;\"><span style=\"color:#333333;\"><br /></span></span></strong></span></p><p><span style=\"font-family:\'微软雅黑\',\'sans-serif\';\"><strong><span style=\"font-size:16px;\"><span style=\"color:#333333;\">百宝香配送范围覆盖全国大部分地区（港澳台地区除外）。</span></span></strong></span></p><br />', '2014-11-12 18:19:24', '5d0cc784c3ec452b96edb88687bc4ba3', '0');
INSERT INTO `bbx_article` VALUES ('50872f7338174474afd0c5a866be49e1', '线上支付', '线上支付', '<p style=\"margin: 0px; padding: 6px 0px; line-height: 22px; color: rgb(102, 102, 102); font-family: Verdana, Geneva, sans-serif;\"><br /></p><p style=\"margin: 0px; padding: 6px 0px; line-height: 22px; color: rgb(102, 102, 102); font-family: Verdana, Geneva, sans-serif;\"><br /></p><h3 style=\"margin: 0px; padding: 6px 0px; line-height: 22px;\"><span style=\"font-family: SimHei; font-size: 16px;\"><span style=\"color:#666666;\">　 &nbsp;</span><span style=\"color:#333333;\">A 支付平台：</span><br /></span></h3><span style=\"color: rgb(102, 102, 102); font-family: Verdana, Geneva, sans-serif; font-size: 11.8181819915771px; line-height: 22px;\">&nbsp; &nbsp; &nbsp; &nbsp;支付宝支付</span><br /><p style=\"margin: 0px; padding: 6px 0px; line-height: 22px; color: rgb(102, 102, 102); font-family: Verdana, Geneva, sans-serif;\"><strong>&nbsp; &nbsp;&nbsp;<img src=\"http://bcs.duapp.com/bbxvip-2014/goods/2014_11_12/19c0402e4024453686d182ae1366f654.jpg\" alt=\"\" /></strong></p><p style=\"margin: 0px; padding: 6px 0px; line-height: 22px; color: rgb(102, 102, 102); font-family: Verdana, Geneva, sans-serif;\">　　如果您已经拥有支付宝账户，可选择支付宝进行付款。&nbsp;</p><p style=\"margin: 0px; padding: 6px 0px; line-height: 22px; color: rgb(102, 102, 102); font-family: Verdana, Geneva, sans-serif;\">　　如果您还不知道如何使用支付宝，请看看这里：<a href=\"http://home.alipay.com/individual/tutorial.htm\" target=\"_blank\" style=\"text-decoration: none; color: rgb(102, 102, 102);\">http://home.alipay.com/individual/tutorial.htm</a></p><p style=\"margin: 0px; padding: 6px 0px; line-height: 22px; color: rgb(102, 102, 102); font-family: Verdana, Geneva, sans-serif;\"><span style=\"font-family: 微软雅黑, sans-serif;\"><br /></span></p><p style=\"margin: 0px; padding: 6px 0px; line-height: 22px;\"><strong><span style=\"font-family: SimHei; font-size: 16px;\"><span style=\"color:#666666;\">　 &nbsp;</span><span style=\"color:#333333;\">B 网银快捷支付：</span></span></strong><br /></p><p style=\"margin: 0px; padding: 6px 0px; line-height: 22px; color: rgb(102, 102, 102); font-family: Verdana, Geneva, sans-serif;\">　　百宝香支持包括中国工商银行、中国农业银行、中国招商银行、中国建设银行、中信银行、中国银行、中国光大银行、兴业银行等在内的16家银行的网上银行支付。</p><img src=\"http://bcs.duapp.com/bbxvip-2014/goods/2014_11_14/967f89274614463da7af18aa9fa26d2d.jpg\" alt=\"\" /><br /><p></p>', '2014-11-12 18:17:13', '7483de843ea14e4f98ca79cc41494c65', '0');
INSERT INTO `bbx_article` VALUES ('6784f9c321aa4b519550598bbbc67e00', '100%正品保障', '100%正品保障', '<h3></h3><p><strong><span style=\"font-size: 9pt; font-family: 微软雅黑, sans-serif; color: rgb(80, 80, 80);\"><br /></span></strong></p><p><strong><span style=\"font-size: 9pt; font-family: 微软雅黑, sans-serif; color: rgb(80, 80, 80);\"><br /></span></strong></p><p><strong><span style=\"font-size: 9pt; font-family: 微软雅黑, sans-serif; color: rgb(80, 80, 80);\">百宝香郑重承诺：</span></strong></p><p><span style=\"font-size: 9pt; font-family: 微软雅黑, sans-serif; color: rgb(80, 80, 80);\">　　</span><span style=\"font-size: 9pt; font-family: 微软雅黑, sans-serif; color: rgb(80, 80, 80);\">百宝香母婴限时特卖平台所售卖的商品均由各大品牌方或其经销商直接供货，杜绝假冒伪劣产品，保障消费合法权益。</span></p><div><span style=\"font-size: 9pt; font-family: 微软雅黑, sans-serif; color: rgb(80, 80, 80);\"><br /></span></div><p></p>', '2014-11-12 17:34:36', 'beaf86395c704b7ebbda1375ba1241f5', '0');
INSERT INTO `bbx_article` VALUES ('758d033a170d42d6b6875a8ff6accd8f', '验货与签收', '验货与签收', '<p><span style=\"font-family:\'微软雅黑\',\'sans-serif\';\"><br /></span></p><p><span style=\"font-family:\'微软雅黑\',\'sans-serif\'; color:333; font-size:14px\">&nbsp;百宝香已与配送公司签订先验货后签收协议，请在配送人员还在场的情况下，请您务必当面对照发货单核对商品，主要检查如下内容：</span></p><p><span style=\"font-family:\'微软雅黑\',\'sans-serif\'; color:333; font-size:14px\">（1）封箱胶带是否为百宝香专用胶带，胶带是否有被拆开重新粘贴过的痕迹；</span></p><p><span style=\"font-family:\'微软雅黑\',\'sans-serif\'; color:333; font-size:14px\">（2）外包装是否破损；</span></p><p><span style=\"font-family:\'微软雅黑\',\'sans-serif\'; color:333; font-size:14px\">（3）商品是否缺少、配送错误。</span></p><p><span style=\"font-family:\'微软雅黑\',\'sans-serif\'; color:333; font-size:14px\">&nbsp;如在检查的过程中出现问题，请您不要签收商品并及时电话联系百宝香客服中心</span></p><p><span style=\"font-family:\'微软雅黑\',\'sans-serif\'; color:333; font-size:14px\">（4000-78-2000），我们会第一时间处理您的问题。</span></p><p><span style=\"font-family:\'微软雅黑\',\'sans-serif\'; color:333; font-size:14px\">&nbsp;如您在订购时选择了&quot;需要发票&quot;，请仔细检查发票是否随商品一起送到，如未收到发票，请通过<u>联系我们</u>（链接联系我们的2级页）客服中心联系为您补开发票。</span></p><p><span style=\"font-family:\'微软雅黑\',\'sans-serif\'; color:333; font-size:14px\">签收后百宝香视为您已经认可并接受本公司商品，出现上述问题将不再进行处理。非订货人本人签收的产品，百宝香视代收人等同于订购人进行验货。</span></p>', '2015-01-15 17:55:10', null, '0');
INSERT INTO `bbx_article` VALUES ('79db8c77f752459d9d00314de568e5e0', '退货流程', '退货流程', '<p><br /></p><p><br /></p><p><img src=\"http://bcs.duapp.com/bbxvip-2014/goods/2014_11_14/5b715ab42b904735b57c8783d2489475.jpg\" alt=\"\" /><br /></p><p><br /></p>', '2014-11-12 18:29:21', 'bd622077146d4d9e91502ec1ea792b6d', '0');
INSERT INTO `bbx_article` VALUES ('7e71eb4ac7ca4587b47a24455b016719', '验货与签收', '验货与签收', '<p><span style=\"font-family:\'微软雅黑\',\'sans-serif\';\">&nbsp;</span></p><p><span style=\"font-family:\'微软雅黑\',\'sans-serif\'; color:#333; font-size:14px\">&nbsp;</span></p><p><span style=\"font-family:\'微软雅黑\',\'sans-serif\'; color:#333; font-size:14px\">百宝香已与配送公司签订先验货后签收协议，请在配送人员还在场的情况下，请您务必当面对照发货单核对商品，主要检查如下内容：<br /><br /></span></p><p><span style=\"font-family:\'微软雅黑\',\'sans-serif\'; color:#333; font-size:14px\">（1）封箱胶带是否为百宝香专用胶带，胶带是否有被拆开重新粘贴过的痕迹；<br /><br /></span></p><p><span style=\"font-family:\'微软雅黑\',\'sans-serif\'; color:#333; font-size:14px\">（2）外包装是否破损；<br /><br /></span></p><p><span style=\"font-family:\'微软雅黑\',\'sans-serif\'; color:#333; font-size:14px\">（3）商品是否缺少、配送错误。<br /><br /></span></p><p><span style=\"font-family:\'微软雅黑\',\'sans-serif\'; color:#333; font-size:14px\">&nbsp;如在检查的过程中出现问题，请您不要签收商品并及时电话联系百宝香客服中心<br /><br /></span></p><p><span style=\"font-family: 微软雅黑, sans-serif; font-size: 14px;\"><span style=\"color:#ff0000;\">（4000-78-2000），</span></span><span style=\"font-family:\'微软雅黑\',\'sans-serif\'; color:#333; font-size:14px\">我们会第一时间处理您的问题。<br /><br /></span></p><p><span style=\"font-family:\'微软雅黑\',\'sans-serif\'; color:#333; font-size:14px\">&nbsp;如您在订购时选择了&quot;需要发票&quot;，请仔细检查发票是否随商品一起送到，如未收到发票，请通过<u>联系我们</u>（链接联系我们的2级页）客服中心联系为您补开发票。<br /><br /></span></p><p><span style=\"font-family:\'微软雅黑\',\'sans-serif\'; color:#333; font-size:14px\">&nbsp;签收后百宝香视为您已经认可并接受本公司商品，出现上述问题将不再进行处理。非订货人本人签收的产品，百宝香视代收人等同于订购人进行验货。</span></p>', '2015-01-15 18:07:54', '5d0cc784c3ec452b96edb88687bc4ba3', '0');
INSERT INTO `bbx_article` VALUES ('a310036c156342378885ad7218754daf', '配送运费', '配送运费', '<p style=\"margin: 0px; padding: 6px 0px; line-height: 22px; color: rgb(102, 102, 102); font-family: Verdana, Geneva, sans-serif;\"></p><p><span style=\"font-family:\'微软雅黑\',\'sans-serif\';\"><br /></span></p><p><span style=\"font-family:\'微软雅黑\',\'sans-serif\'; color:#333; font-size:14px\">百宝香暂时全国大部分地区（港澳台地区除外）运费全场免邮，个别特殊商品可能需要增加运费，具体会在该商品介绍页注明。超出配送范围的订单邮费自理或者申请退款。</span></p><p><span style=\"font-family:\'微软雅黑\',\'sans-serif\';color:#333; font-size:14px\">百宝香采用的是统一配送费标准，一张订单无论购买多少商品只收取一次运费，不收取续重费。如遇品牌商直发商品，百宝香将自动拆单给您配送，不重复收取运费。</span></p><p><span style=\"font-family:\'微软雅黑\',\'sans-serif\';\">&nbsp;</span></p><p style=\"margin: 0px; padding: 6px 0px; line-height: 22px; color: rgb(102, 102, 102); font-family: Verdana, Geneva, sans-serif;\"></p>', '2014-11-12 18:25:36', '5d0cc784c3ec452b96edb88687bc4ba3', '0');
INSERT INTO `bbx_article` VALUES ('ae1abc91caaf4dad8406a0ca544b1f7e', '优惠券', '优惠券', '<p><span style=\"font-weight: bold;\"><span style=\"font-family: 宋体;\"><span style=\"color: rgb(51, 51, 51);\"><span style=\"font-size:14px;\"><br /></span></span></span></span></p><p><span style=\"color: rgb(51, 51, 51); font-family: 微软雅黑, sans-serif;\"><span style=\"font-size:14px;\"><br /></span></span></p><p><span style=\"font-size:14px;\"><span style=\"font-family: 微软雅黑, sans-serif; color: rgb(51, 51, 51);\">一、什么是优惠券？<br /></span><br /></span></p><p><span style=\"font-family: 微软雅黑, sans-serif;\"><span style=\"color:#333333;\"><span style=\"color: rgb(51, 51, 51);\"><span style=\"font-size:14px;color:#333333\">优惠券是百宝香为回馈广大会员而推出的优惠券，设有消费限额，有效期根据获得情况而定，下单订购时满足使用条件即可抵扣商品金额，不能抵扣运费。<br /><br /></span></span></span></span></p><p><span style=\"font-family:\'微软雅黑\',\'sans-serif\';\"><span style=\"color:#333333;\"><span style=\"color: rgb(51, 51, 51);\"><span style=\"font-size:14px;color:#333333\">二、优惠券使用帮助<br /><br /></span></span></span></span></p><p><span style=\"font-family:\'微软雅黑\',\'sans-serif\';\"><span style=\"color:#333333;\"><span style=\"color: rgb(51, 51, 51);\"><span style=\"font-size:14px;color:#333333\">获得途径<br /></span></span></span></span></p><p><span style=\"color: rgb(51, 51, 51); font-family: 微软雅黑, sans-serif;\"><span style=\"font-size:14px;color:#333333\">会员等级的晋升、活动赠送、百宝香客服补偿等。<br /><br /></span></span></p><p><span style=\"font-family: 微软雅黑, sans-serif;\"><span style=\"color:#333333;\"><span style=\"color: rgb(51, 51, 51);\"><span style=\"font-size:14px;color:#333333\">三、常见问题解答<br /><br /></span></span></span></span></p><p><span style=\"font-size:14px;\"><span style=\"color:#333333;\"><span style=\"font-family: 微软雅黑, sans-serif; color:#333333;\">Q</span><span style=\"font-family: 微软雅黑, sans-serif; color:#333333;\">：怎样可以获得优惠券？<br /></span></span><span style=\"color: rgb(51, 51, 51); font-family: 微软雅黑, sans-serif;\">A</span><span style=\"color: rgb(51, 51, 51); font-family: 微软雅黑, sans-serif;\">：您可以参加百宝香不定期推出回馈会员的活动，可以获得优惠券，优惠券的金额及使用的方法以当次的活动规则为准。获得后只要在有效期内在您下订单时满足消费限额，优惠券可以直接冲减您的订单金额。</span><span style=\"color:#333333;\"><span style=\"font-family: 微软雅黑, sans-serif; color:#333333;\"><br /></span></span></span></p><p><span style=\"font-family:\'微软雅黑\',\'sans-serif\';\"><span style=\"color:#333333;\"><span style=\"font-size:14px;\">&nbsp;</span></span></span></p><p><span style=\"font-size:14px;\"><span style=\"color:#333333;\"><span style=\"font-family:\'微软雅黑\',\'sans-serif\'; color:#333333;\">Q</span><span style=\"font-family:\'微软雅黑\',\'sans-serif\'; color:#333333;\">：优惠券的有效时间是多长？<br /></span></span><span style=\"color: rgb(51, 51, 51); font-family: 微软雅黑, sans-serif;\">A</span><span style=\"color: rgb(51, 51, 51); font-family: 微软雅黑, sans-serif;\">：由于各个活动获得优惠券的有效时限均不一致，建议您可以登陆您的个人帐户查看您的优惠券的有效时限，谢谢。</span><span style=\"color:#333333;\"><span style=\"font-family:\'微软雅黑\',\'sans-serif\'; color:#333333;\"><br /></span></span></span></p><p><span style=\"font-family:\'微软雅黑\',\'sans-serif\';\"><span style=\"color:#333333;\"><span style=\"font-size:14px;\">&nbsp;</span></span></span></p><p><span style=\"font-size:14px;\"><span style=\"color:#333333;\"><span style=\"font-family:\'微软雅黑\',\'sans-serif\'; color:#333333;\">Q</span><span style=\"font-family:\'微软雅黑\',\'sans-serif\'; color:#333333;\">：为什么我的优惠券无法使用？<br /></span></span><span style=\"color: rgb(51, 51, 51); font-family: 微软雅黑, sans-serif;\">A</span><span style=\"color: rgb(51, 51, 51); font-family: 微软雅黑, sans-serif;\">：a、优惠券已过使用有效期</span><span style=\"color:#333333;\"><span style=\"font-family:\'微软雅黑\',\'sans-serif\'; color:#333333;\"><br /></span></span></span></p><p><span style=\"color:#333333;\"><span style=\"font-size:14px;\"><span style=\"font-family:\'微软雅黑\',\'sans-serif\'; color:#333333;\">&nbsp; &nbsp; &nbsp; b</span><span style=\"font-family:\'微软雅黑\',\'sans-serif\'; color:#333333;\">、没能达到优惠券的消费限额（优惠券必须在达到XX元消费限额后才能使用。如果您达到消费限额，可以在填写收货信息时，选择“使用优惠券”，提交订单后优惠券可以直接冲减您的商品金额。）</span></span></span></p><p><span style=\"font-family:\'微软雅黑\',\'sans-serif\';\"><span style=\"color:#333333;\"><span style=\"font-size:14px;\">&nbsp;</span></span></span></p><p><span style=\"font-size:14px;\"><span style=\"color:#333333;\"><span style=\"font-family:\'微软雅黑\',\'sans-serif\'; color:#333333;\">Q</span><span style=\"font-family:\'微软雅黑\',\'sans-serif\'; color:#333333;\">：同一张订单可以同时使用几张优惠券吗？<br /></span></span><span style=\"color: rgb(51, 51, 51); font-family: 微软雅黑, sans-serif;\">A</span><span style=\"color: rgb(51, 51, 51); font-family: 微软雅黑, sans-serif;\">：一张订单只能使用一张优惠券。</span><span style=\"color:#333333;\"><span style=\"font-family:\'微软雅黑\',\'sans-serif\'; color:#333333;\"><br /></span></span></span></p><p><span style=\"font-family:\'微软雅黑\',\'sans-serif\';\"><span style=\"color:#333333;\"><span style=\"font-size:14px;\">&nbsp;</span></span></span></p><p><span style=\"font-size:14px;\"><span style=\"color:#333333;\"><span style=\"font-family:\'微软雅黑\',\'sans-serif\'; color:#333333;\">Q</span><span style=\"font-family:\'微软雅黑\',\'sans-serif\'; color:#333333;\">：优惠券是否可以抵扣运费？<br /></span></span><span style=\"color: rgb(51, 51, 51); font-family: 微软雅黑, sans-serif;\">A</span><span style=\"color: rgb(51, 51, 51); font-family: 微软雅黑, sans-serif;\">：优惠券只能冲减商品金额，无法抵扣运费。</span><span style=\"color:#333333;\"><span style=\"font-family:\'微软雅黑\',\'sans-serif\'; color:#333333;\"><br /></span></span></span></p><p><span style=\"font-family:\'微软雅黑\',\'sans-serif\';\"><span style=\"color:#333333;\"><span style=\"font-size:14px;\">&nbsp;</span></span></span></p><p><span style=\"font-size:14px;\"><span style=\"color:#333333;\"><span style=\"font-family:\'微软雅黑\',\'sans-serif\'; color:#333333;\">Q</span><span style=\"font-family:\'微软雅黑\',\'sans-serif\'; color:#333333;\">：优惠券是否可以合并或赠送给他人使用？<br /></span></span><span style=\"color: rgb(51, 51, 51); font-family: 微软雅黑, sans-serif;\">A</span><span style=\"color: rgb(51, 51, 51); font-family: 微软雅黑, sans-serif;\">：优惠券是无法合并使用，每张订单只能使用1张优惠券，且无法转移到其它帐户中。</span></span><span style=\"color:#333333;\"><span style=\"font-size:16px;\"><span style=\"font-family:\'微软雅黑\',\'sans-serif\'; color:#333333;\"><br /></span></span></span></p>', '2014-11-14 20:08:12', '7483de843ea14e4f98ca79cc41494c65', '0');
INSERT INTO `bbx_article` VALUES ('ba878465093d4739972efb1f1f5bcca0', '退货政策', '退货政策', '<h3 style=\"margin: 0px; padding: 6px 0px; line-height: 22px; color: rgb(102, 102, 102); font-family: Verdana, Geneva, sans-serif;\"></h3><p><span style=\"font-family:\'微软雅黑\',\'sans-serif\';color:#333; font-size:14px\">1.</span><span style=\"font-family:\'微软雅黑\',\'sans-serif\';color:#333; font-size:14px\">天无理由退货条例总则</span></p><p><span style=\"font-family:\'微软雅黑\',\'sans-serif\';color:#333; font-size:14px\">自签收之日起15日内（以快递公司的送货单上的签收日期为准）</span></p><p><span style=\"font-family:\'微软雅黑\',\'sans-serif\';\">&nbsp;</span></p><p><span style=\"font-family:\'微软雅黑\',\'sans-serif\';color:#333; font-size:14px\">2.</span><span style=\"font-family:\'微软雅黑\',\'sans-serif\';color:#333; font-size:14px\">哪些商品不支持7天无理由退货</span></p><p><span style=\"font-family:\'微软雅黑\',\'sans-serif\';color:#333; font-size:14px\">（1）消费者个人定作类商品；</span></p><p><span style=\"font-family:\'微软雅黑\',\'sans-serif\';color:#333; font-size:14px\">（2）鲜活易腐类商品；</span></p><p><span style=\"font-family:\'微软雅黑\',\'sans-serif\';color:#333; font-size:14px\">（3）在线下载或者消费者已拆封的音像制品，计算机软件等数字化商品；</span></p><p><span style=\"font-family:\'微软雅黑\',\'sans-serif\';color:#333; font-size:14px\">（4）其他详情页已经提示不予退换货商品。 </span></p><p><span style=\"font-family:\'微软雅黑\',\'sans-serif\';\">&nbsp;</span></p><p><span style=\"font-family:\'微软雅黑\',\'sans-serif\';color:#333; font-size:14px\">3.</span><span style=\"font-family:\'微软雅黑\',\'sans-serif\';color:#333; font-size:14px\">出现下列情形时，消费者可在签收15天内无理由退货</span></p><p><span style=\"font-family:\'微软雅黑\',\'sans-serif\';color:#333; font-size:14px\">（1）商品质量问题；</span></p><p><span style=\"font-family:\'微软雅黑\',\'sans-serif\';color:#333; font-size:14px\">（2）商品及商品本身包装保持百宝香出售时原装且配件赠品资料齐全，不影响二次销售的。</span></p><p><span style=\"font-family:\'微软雅黑\',\'sans-serif\';\">&nbsp;</span></p><p><span style=\"font-family:\'微软雅黑\',\'sans-serif\';color:#333; font-size:14px\">4.</span><span style=\"font-family:\'微软雅黑\',\'sans-serif\';color:#333; font-size:14px\">出现下列情形时，不予退货</span></p><p><span style=\"font-family:\'微软雅黑\',\'sans-serif\';color:#333; font-size:14px\">（1）任何非百宝香出售的商品；</span></p><p><span style=\"font-family:\'微软雅黑\',\'sans-serif\';color:#333; font-size:14px\">（2）百宝香指定的特殊商品，如：贴身衣物（内衣、袜子、文胸、泳衣等）不允许试穿，洗护商品不允许试用，如您收下货物后，发现质量问题，可以通过<u>联系我们</u>客服中心为您办理退货业务。</span></p><p><span style=\"font-family:\'微软雅黑\',\'sans-serif\';color:#333; font-size:14px\">（3）外包装破损货配件不齐全的商品（包括：吊牌丢失或已被从商品中剪下；商品附件说明书、商品标签、商品保修单丢失或破损；商品外包装破损等）；</span></p><p><span style=\"font-family:\'微软雅黑\',\'sans-serif\';color:#333; font-size:14px\">（4）购买时有赠品的商品，未将赠品退回；</span></p><p><span style=\"font-family:\'微软雅黑\',\'sans-serif\';color:#333; font-size:14px\">（5）未经授权的维修、误用、碰撞、疏忽、滥用、进液、事故、改动、不正确的安装所造成的商品质量问题，或撕毁、涂改标贴、机器序号、防伪标记；</span></p><p><span style=\"font-family:\'微软雅黑\',\'sans-serif\';color:#333; font-size:14px\">（6）其他依法不应办理退换货的。</span></p><p><span style=\"font-family:\'微软雅黑\',\'sans-serif\';\">&nbsp;</span></p><p><span style=\"font-family:\'微软雅黑\',\'sans-serif\';color:#333; font-size:14px\">5.</span><span style=\"font-family:\'微软雅黑\',\'sans-serif\';color:#333; font-size:14px\">退货运费由谁承担</span></p><p><span style=\"font-family:\'微软雅黑\',\'sans-serif\';color:#333; font-size:14px\">（1）因商品质量问题产生的退货，退回商品的运费由百宝香承担（商品寄回运费先由客户垫付，我们接到商品确认质量问题后，为您报销商品寄回运费）。</span></p><p><span style=\"font-family:\'微软雅黑\',\'sans-serif\';color:#333; font-size:14px\">（2）由于款式、颜色、尺码喜好等产生的个人原因退货，商品寄回的运费由客户自行承担。同样原因拒收订单商品，退回订单时，将扣除因拒收产生的运费。运费按照当地邮寄标准扣除。</span></p><p><span style=\"font-family:\'微软雅黑\',\'sans-serif\';\">&nbsp;</span></p><p><span style=\"font-family:\'微软雅黑\',\'sans-serif\';color:#333; font-size:14px\">6.</span><span style=\"font-family:\'微软雅黑\',\'sans-serif\';color:#333; font-size:14px\">百宝香暂不支持换货服务，望您谅解。</span></p><p style=\"margin: 0px; padding: 6px 0px; line-height: 22px; color: rgb(102, 102, 102); font-family: Verdana, Geneva, sans-serif;\"><br /></p>', '2014-11-12 18:27:38', 'bd622077146d4d9e91502ec1ea792b6d', '0');
INSERT INTO `bbx_article` VALUES ('bd2c47d51ff94dadaaa15183cd64b279', '投诉及建议', '投诉及建议', '<p><span style=\"font-family:\'微软雅黑\',\'sans-serif\';\"><br /></span></p><p><span style=\"font-family:\'微软雅黑\',\'sans-serif\';color:#333; font-size:14px\">（1）您可通过联系我们反馈您的问题，您提交的问题将会在24小时内得到回应。</span></p><p><span style=\"font-family:\'微软雅黑\',\'sans-serif\';color:#333; font-size:14px\">（2）如果您对在百宝香所购买的商品的品牌存在怀疑，请在收到商品的90天内，到工商部门进行产品鉴定，假如鉴定结果为非品牌正品，即可拿相关证明百宝香索取10倍等同该商品售价的全额赔偿，另外请通知百宝香，我们将会陪同您进行全面的查证和调研。</span></p><p><span style=\"font-family:\'微软雅黑\',\'sans-serif\';color:#333; font-size:14px\">（3）如果会员与百宝香之间发生任何争议，可依据当时双方所认定的协议或有关法律来解决。</span></p>', '2015-01-15 18:53:14', 'bd622077146d4d9e91502ec1ea792b6d', '0');
INSERT INTO `bbx_article` VALUES ('d0e9499dc0584f2f848f857592a4c029', '关于百宝香', '关于百宝香', '<p><span style=\"font-family: SimSun;\"><span style=\"font-size: 12px; background-color: rgb(255, 255, 255);\"><br /></span></span></p><p><span style=\"font-family: SimSun;\"><span style=\"font-size: 12px; background-color: rgb(255, 255, 255);color:#333; font-size:14px\">&nbsp; &nbsp; &nbsp; 百宝香是杭州金婴汇科技有限公司旗下的一家专注于母婴时尚名品限时特卖的网站，百宝香以供应商寄售特卖的方式进行销售，通过收取交易佣金获得收入，这种模式较同行的采买模式更轻，不承担库存及资金占用的风险与压力；入仓模式较同行更能确保极致的购买体验；同时相对天猫、京东等综合类平台高额的累计费用，商家经营成本更低，也更能促使商家让利给用户。同时，百宝香具备极强的家庭微社交互动性，以家庭为单位，分为爸爸版与妈妈版，通过家庭内部之间、家庭与家庭之间的趣味互动促进用户粘性以及品牌传播性，将购物与微社交进行了有效结合。</span></span></p><p><span style=\"font-family: SimSun;\"><span style=\"font-size: 12px; background-color: rgb(255, 255, 255);color:#333; font-size:14px\">&nbsp; &nbsp; &nbsp; 百宝香平台的运营商杭州金婴汇科技有限公司成立于2014年，是一家专注于母婴亲子特卖的科技型电子商务公司，公司创始人高巍，系特宝贝母婴商城创始人，黑马营五期成员，2010发起成立特宝贝，带领团队从零开始，至今成长为母婴行业全网前列的知名母婴渠道品牌，年均交易额数千万元。联合创始人向文滔，系原奥康集团电子商务事业部总经理，4年时间带领奥康集团电子商务团队创造从0到4个亿的业绩；联合创始人谢尚凯，曾担任上市外企技术高管，领导多个商业平台设计与开发，主要负责平台架构设计优化，是行业知名的顶尖技术人才；联合创始人周璐，系国内第一代网络营销师，避风网络创始人，服务过多家世界500强企业，后任新浪微博浙江服务商金瓯传媒总经理。具备丰富的互联网营销实操经验。联合创始人陈成计，阿波罗网络科技，潜龙互动网络科技企业创立者，12年互联网公司销售及销售管理工作经历，从事过3721，新浪，雅虎，阿里巴巴，GOOGLE, 360，搜狗，百度等互联网产品销售及渠道建设，成功帮助上千家中小企业利用互联网产品获得成功”。</span></span></p><p><span style=\"font-family: SimSun;\"><span style=\"font-size: 12px; background-color: rgb(255, 255, 255);color:#333; font-size:14px\">&nbsp; &nbsp; &nbsp; 百宝香是一家科技型电子商务企业，崇尚简单、创新、高效的互联网文化，鼓励员工与公司一起快乐、快速地成长。百宝香视每一位中国宝宝的健康成长为驱动力，百宝香的企业发展愿景是“助力中国宝宝健康成长”，希望通过自身的不懈努力，为中国的母婴用户创造更安全、更便捷、更实惠的购物体验。</span></span></p>', '2014-12-16 17:53:58', 'beaf86395c704b7ebbda1375ba1241f5', '0');
INSERT INTO `bbx_article` VALUES ('d68dbd1f3d6b44869575d3d79223ce8e', '会员等级', '会员等级', '<p style=\"margin: 0px; padding: 6px 0px; line-height: 22px; color: rgb(102, 102, 102); font-family: 微软雅黑, sans-serif;\"></p><p><span style=\"font-size:9pt;font-family: 微软雅黑, sans-serif;color:rgb(102, 102, 102);\"><br /></span></p><p><span style=\"font-size:9pt;font-family: 微软雅黑, sans-serif;color:rgb(102, 102, 102);\">根据香亲们在百宝香的消费积分情况，我们设定了以下四个会员等级，达成条件与会员特权说明详情如下：</span></p><p><strong><span style=\"font-size:9pt;font-family: 微软雅黑, sans-serif;color:rgb(102, 102, 102);\">会员等级达成条件：</span></strong></p><p style=\"margin: 0px; padding: 6px 0px; line-height: 22px; color: rgb(102, 102, 102); font-family: Verdana, Geneva, sans-serif;\"><img src=\"http://bcs.duapp.com/bbxvip-2014/goods/2014_11_14/34903b342b8a4a298073a63b0b44cf16.jpg\" alt=\"\" /><br /><br /></p>', '2014-11-12 18:07:23', '58a572275b434d2a9e1b120484e98807', '0');
INSERT INTO `bbx_article` VALUES ('e4d64a0f326a42c9b139c917318963ba', '退款说明', '退款说明', '<div><p><span style=\"font-family:\'微软雅黑\',\'sans-serif\';\"><br /></span></p><p><span style=\"font-family:\'微软雅黑\',\'sans-serif\';\"><br /></span></p><p><span style=\"font-family:\'微软雅黑\',\'sans-serif\';color:#333; font-size:14px\">（1）如您的退货已经办理完毕，我们会及时将相关款项退还给您。</span></p><p><span style=\"font-family:\'微软雅黑\',\'sans-serif\';color:#333; font-size:14px\">（2）如您使用支付宝余额支付，款项将会退到您的支付宝余额；</span></p><p><span style=\"font-family:\'微软雅黑\',\'sans-serif\';color:#333; font-size:14px\">（3）如您使用银行卡或信用卡支付，信用卡支付的订单金额原路退回信用卡，办理后需要3～15个工作日到账。</span></p><br /></div>', '2015-01-12 15:39:25', 'bd622077146d4d9e91502ec1ea792b6d', '0');
INSERT INTO `bbx_article` VALUES ('e5b74b8bb0444d84afde4cbe0314ca3e', '退款方式和时效', '退款方式和时效', '<p style=\"margin: 0px; padding: 6px 0px; line-height: 22px; color: rgb(102, 102, 102); font-family: Verdana, Geneva, sans-serif;\"></p><p><strong><span style=\"font-size:9pt;font-family:宋体;color:rgb(102, 102, 102);\"><br /></span></strong></p><p><strong><span style=\"font-size:9pt;font-family:宋体;color:rgb(102, 102, 102);\"><br /></span></strong></p><p><strong><span style=\"font-size:9pt;font-family:宋体;color:rgb(102, 102, 102);\"></span></strong></p><p><span style=\"font-family:\'微软雅黑\',\'sans-serif\';color:#333; font-size:14px\">（1）原订单运费退不退回</span></p><p><span style=\"font-family:\'微软雅黑\',\'sans-serif\';color:#333; font-size:14px\">满额免运费的订单，发生退货后订单金额包邮政策，或者整单退货，仍需支付该次购物运费即退款金额为扣除原订购运费之后的金额。</span></p><p><span style=\"font-size:9pt;font-family:宋体;color:rgb(102, 102, 102);\"></span></p><p style=\"margin: 0px; padding: 6px 0px; line-height: 22px; color: rgb(102, 102, 102); font-family: Verdana, Geneva, sans-serif;\"></p>', '2014-11-12 18:29:46', 'bd622077146d4d9e91502ec1ea792b6d', '0');
INSERT INTO `bbx_article` VALUES ('e7d9eafe28bc468fb1e377f880c2848c', '验货与签收', '验货与签收', '<p><span style=\"font-family:\'微软雅黑\',\'sans-serif\';\">&nbsp;</span></p><p><span style=\"font-family:\'微软雅黑\',\'sans-serif\'; color:333; font-size:14px\">&nbsp;百宝香已与配送公司签订先验货后签收协议，请在配送人员还在场的情况下，请您务必当面对照发货单核对商品，主要检查如下内容：</span></p><p><span style=\"font-family:\'微软雅黑\',\'sans-serif\'; color:333; font-size:14px\">（1）封箱胶带是否为百宝香专用胶带，胶带是否有被拆开重新粘贴过的痕迹；</span></p><p><span style=\"font-family:\'微软雅黑\',\'sans-serif\'; color:333; font-size:14px\">（2）外包装是否破损；</span></p><p><span style=\"font-family:\'微软雅黑\',\'sans-serif\'; color:333; font-size:14px\">（3）商品是否缺少、配送错误。</span></p><p><span style=\"font-family:\'微软雅黑\',\'sans-serif\'; color:333; font-size:14px\">&nbsp;如在检查的过程中出现问题，请您不要签收商品并及时电话联系百宝香客服中心</span></p><p><span style=\"font-family:\'微软雅黑\',\'sans-serif\'; color:333; font-size:14px\">（4000-78-2000），我们会第一时间处理您的问题。</span></p><p><span style=\"font-family:\'微软雅黑\',\'sans-serif\'; color:333; font-size:14px\">&nbsp;如您在订购时选择了&quot;需要发票&quot;，请仔细检查发票是否随商品一起送到，如未收到发票，请通过<u>联系我们</u>（链接联系我们的2级页）客服中心联系为您补开发票。</span></p><p><span style=\"font-family:\'微软雅黑\',\'sans-serif\'; color:333; font-size:14px\">&nbsp;签收后百宝香视为您已经认可并接受本公司商品，出现上述问题将不再进行处理。非订货人本人签收的产品，百宝香视代收人等同于订购人进行验货。</span></p>', '2015-01-15 17:52:00', null, '0');
INSERT INTO `bbx_article` VALUES ('f1100dde74a44c7c819a495df5e92370', '配送时效', '配送时效', '<p style=\"margin: 0px; padding: 6px 0px; line-height: 22px; color: rgb(102, 102, 102); font-family: Verdana, Geneva, sans-serif;\"></p><p><span style=\"font-family:\'微软雅黑\',\'sans-serif\'; color:#333; font-size:14px\"><br /></span></p><p><span style=\"font-family:\'微软雅黑\',\'sans-serif\'; color:#333; font-size:14px\">&nbsp; &nbsp; &nbsp; &nbsp; 百宝香承诺，会员的订单如未能在承诺配送时效内送达会员手上，百宝香将为此赠送￥10代金券（50元消费限额，三个月有效期）至会员账号以作补偿；会员之订单由发货日起超出15天仍未能成功送达，百宝香可按会员要求办理退货并赠送￥20代金券（100元消费限额，三个月有效期）做为补偿。</span></p><p><span style=\"font-family:\'微软雅黑\',\'sans-serif\';color:#333; font-size:14px\">注：如遇交通管制、大雨雪、洪涝、冰灾、地震、节假日、停电等不可抗力因素均不在承诺服务范围内。</span></p><br />', '2014-11-12 18:20:57', '5d0cc784c3ec452b96edb88687bc4ba3', '0');
INSERT INTO `bbx_article` VALUES ('fcd4a0b2a4ea4567b736c6205ff21e11', '会员注册', '会员注册', '<h3 style=\"margin: 0px; padding: 6px 0px; line-height: 22px; color: rgb(102, 102, 102); font-family: 微软雅黑, sans-serif;\"><span style=\"font-size: 12px;\"><br /></span></h3><h3 style=\"margin: 0px; padding: 6px 0px; line-height: 22px; font-family: 微软雅黑, sans-serif;\"><span style=\"font-size:16px;color:#333333;\">&nbsp; &nbsp;如何注册百宝香账户：</span><br /></h3><p style=\"margin: 0px; padding: 6px 0px; line-height: 22px; color: rgb(102, 102, 102); font-family: 微软雅黑, sans-serif;\">&nbsp; &nbsp; 您访问百宝香官网后，点击右上角的“免费注册”，即可进入到账户注册环节。</p><p style=\"margin: 0px; padding: 6px 0px; line-height: 22px; color: rgb(102, 102, 102); font-family: Verdana, Geneva, sans-serif;\"><img src=\"http://bcs.duapp.com/bbxvip-2014/goods/2014_11_15/68cee8498a2844268bc644742164545c.jpg\" alt=\"\" /><br /></p>', '2014-11-12 17:57:48', '58a572275b434d2a9e1b120484e98807', '0');

-- ----------------------------
-- Table structure for bbx_articlecategory
-- ----------------------------
DROP TABLE IF EXISTS `bbx_articlecategory`;
CREATE TABLE `bbx_articlecategory` (
  `Id` varchar(50) NOT NULL,
  `ArticleCategoryTitle` text,
  `ArticleCategorySort` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

-- ----------------------------
-- Records of bbx_articlecategory
-- ----------------------------
INSERT INTO `bbx_articlecategory` VALUES ('58a572275b434d2a9e1b120484e98807', '会员中心', '2');
INSERT INTO `bbx_articlecategory` VALUES ('5d0cc784c3ec452b96edb88687bc4ba3', '配送方式', '4');
INSERT INTO `bbx_articlecategory` VALUES ('7483de843ea14e4f98ca79cc41494c65', '支付方式', '3');
INSERT INTO `bbx_articlecategory` VALUES ('bd622077146d4d9e91502ec1ea792b6d', '售后服务', '5');
INSERT INTO `bbx_articlecategory` VALUES ('beaf86395c704b7ebbda1375ba1241f5', '购物指南', '1');

-- ----------------------------
-- Table structure for bbx_brands
-- ----------------------------
DROP TABLE IF EXISTS `bbx_brands`;
CREATE TABLE `bbx_brands` (
  `Id` varchar(50) NOT NULL DEFAULT '',
  `BrandTitle` varchar(50) DEFAULT NULL,
  `BrandInfo` varchar(100) DEFAULT NULL,
  `BrandSort` smallint(6) DEFAULT NULL,
  `CreateTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `BrandLogo` varchar(300) DEFAULT NULL,
  `State` tinyint(4) DEFAULT '0',
  `MerchantId` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Id` (`Id`),
  KEY `BrandTitle` (`BrandTitle`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of bbx_brands
-- ----------------------------

-- ----------------------------
-- Table structure for bbx_cart
-- ----------------------------
DROP TABLE IF EXISTS `bbx_cart`;
CREATE TABLE `bbx_cart` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `UserId` varchar(45) DEFAULT NULL,
  `Cart` mediumtext,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `UserId_UNIQUE` (`UserId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of bbx_cart
-- ----------------------------
INSERT INTO `bbx_cart` VALUES ('1', 'bb31766739ee132a9f24e1cbb867b33f', '[{\"skuId\":\"799d5c408ecb11e693bd1beeb29b91b8\",\"num\":2}]');
INSERT INTO `bbx_cart` VALUES ('2', '5895c87656ed4bf2840c478a06e81d17', '[{\"skuId\":\"87b262b08ed211e6ab43150b992cbf23\",\"num\":1},{\"skuId\":\"0685a0c08f8211e69e4b3ddcf5f6e603\",\"num\":2}]');

-- ----------------------------
-- Table structure for bbx_consignee
-- ----------------------------
DROP TABLE IF EXISTS `bbx_consignee`;
CREATE TABLE `bbx_consignee` (
  `Id` varchar(100) NOT NULL,
  `MemberId` varchar(100) DEFAULT NULL,
  `ConsigneeName` varchar(100) DEFAULT NULL,
  `ConsigneeMobile` varchar(100) DEFAULT NULL,
  `Province` varchar(100) DEFAULT NULL,
  `County` varchar(100) DEFAULT NULL,
  `City` varchar(100) DEFAULT NULL,
  `Address` varchar(100) DEFAULT NULL,
  `CreateTime` datetime DEFAULT NULL,
  `IsDefault` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Id` (`Id`),
  KEY `MemberId` (`MemberId`,`ConsigneeName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of bbx_consignee
-- ----------------------------

-- ----------------------------
-- Table structure for bbx_consignee4orders
-- ----------------------------
DROP TABLE IF EXISTS `bbx_consignee4orders`;
CREATE TABLE `bbx_consignee4orders` (
  `Id` varchar(100) NOT NULL COMMENT '订单ID',
  `ConsigneeName` varchar(100) DEFAULT NULL,
  `ConsigneeMobile` varchar(100) DEFAULT NULL,
  `ExpressTimeType` varchar(100) DEFAULT NULL,
  `Province` varchar(100) DEFAULT NULL,
  `City` varchar(100) DEFAULT NULL,
  `County` varchar(100) DEFAULT NULL,
  `Address` varchar(500) DEFAULT NULL,
  `CreateTime` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Id` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of bbx_consignee4orders
-- ----------------------------

-- ----------------------------
-- Table structure for bbx_express4orders
-- ----------------------------
DROP TABLE IF EXISTS `bbx_express4orders`;
CREATE TABLE `bbx_express4orders` (
  `Id` varchar(100) NOT NULL,
  `OrderId` varchar(50) DEFAULT NULL,
  `ExpressName` varchar(100) DEFAULT NULL,
  `ExpressAliasesName` varchar(100) DEFAULT NULL,
  `ExpressCode` varchar(100) DEFAULT NULL,
  `CreateTime` datetime DEFAULT NULL,
  `ExpressStatus` tinyint(10) NOT NULL DEFAULT '0' COMMENT '是否需要推送的状态，默认为0 需要推送，1已推送，不需要再推送了',
  `ExpressInfo` text,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Id` (`Id`) USING BTREE,
  KEY `express_order` (`OrderId`) USING BTREE,
  KEY `index4` (`ExpressStatus`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

-- ----------------------------
-- Records of bbx_express4orders
-- ----------------------------

-- ----------------------------
-- Table structure for bbx_favorite
-- ----------------------------
DROP TABLE IF EXISTS `bbx_favorite`;
CREATE TABLE `bbx_favorite` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `UserId` varchar(45) DEFAULT NULL,
  `GoodsGroupId` varchar(45) DEFAULT NULL,
  `CreateTime` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_u_f` (`UserId`,`GoodsGroupId`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of bbx_favorite
-- ----------------------------

-- ----------------------------
-- Table structure for bbx_goods
-- ----------------------------
DROP TABLE IF EXISTS `bbx_goods`;
CREATE TABLE `bbx_goods` (
  `Id` varchar(50) NOT NULL,
  `GoodsTitle` varchar(100) DEFAULT NULL,
  `GoodsShortTitle` varchar(100) DEFAULT NULL,
  `GoodsPrice` float DEFAULT NULL,
  `GoodsCostPrice` float DEFAULT NULL,
  `GoodsSupplyPrice` float DEFAULT '0' COMMENT '供货价',
  `GoodsStock` int(11) DEFAULT NULL,
  `GoodsImgPath` varchar(200) DEFAULT NULL,
  `GoodsNumber` varchar(50) DEFAULT NULL,
  `CreateTime` datetime DEFAULT NULL,
  `Outeriid` varchar(255) DEFAULT NULL,
  `Skuid` varchar(255) DEFAULT NULL,
  `GoodsGroupId` varchar(50) DEFAULT NULL,
  `FilterConfig` varchar(50) DEFAULT NULL COMMENT '商品规格',
  `MaxCount` smallint(11) DEFAULT '0' COMMENT '库存',
  `OriginalCount` smallint(11) DEFAULT '0' COMMENT '可用库存',
  `GoodsSalePrice` float DEFAULT NULL COMMENT '商品售价',
  `LimitCount` smallint(11) DEFAULT '0' COMMENT '限购',
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Skuid` (`Skuid`,`GoodsGroupId`) USING BTREE,
  KEY `GoodsTitle` (`GoodsTitle`,`GoodsShortTitle`) USING BTREE,
  KEY `GoodsGroupId` (`GoodsGroupId`) USING BTREE,
  CONSTRAINT `bbx_goods_ibfk_1` FOREIGN KEY (`GoodsGroupId`) REFERENCES `bbx_goodsgroup` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

-- ----------------------------
-- Records of bbx_goods
-- ----------------------------
INSERT INTO `bbx_goods` VALUES ('0685a0c08f8211e69e4b3ddcf5f6e603', '巧克力 黄色,32码', '巧克力 黄色,32码', '1', '1.1', '1', '0', '', '', '2016-10-11 07:12:09', 'QK', 'QK1', '05f213508f8211e69e4b3ddcf5f6e603', '黄色,32码', '50', '2', '1.1', '0');
INSERT INTO `bbx_goods` VALUES ('4b4255108ed711e69a46e996b4e35937', '111 深紫色,18码', '111 深紫色,18码', '11', '1.1', '1', '0', '', '', '2016-10-10 10:50:01', '1111', '11111111', '4b38df308ed711e69a46e996b4e35937', '深紫色,18码', '49', '2', '1.1', '0');
INSERT INTO `bbx_goods` VALUES ('799d5c408ecb11e693bd1beeb29b91b8', '京城21 红色,15码', '京城21 红色,15码', '1', '1', '1', null, null, null, '2016-10-11 09:26:26', 'JC1001', 'JC10010', '799371308ecb11e693bd1beeb29b91b8', '红色,15码', '48', '60', '1', '0');
INSERT INTO `bbx_goods` VALUES ('7bf01280943411e6ab34ff56e73715cf', '羊肉 酒红色,13码', '羊肉 酒红色,13码', '100', '100', '100', null, null, null, '2016-10-19 07:14:12', 'YR1000', 'YR10001', '7be1baa0943411e6ab34ff56e73715cf', '酒红色,13码', '12', '15', '100', '0');
INSERT INTO `bbx_goods` VALUES ('87b262b08ed211e6ab43150b992cbf23', '管理员添加 深蓝色,12码', '管理员添加 深蓝色,12码', '1', '1.1', '1', '0', '', '', '2016-10-10 10:15:55', 'GL1001', 'GL1001', '87a7b4508ed211e6ab43150b992cbf23', '深蓝色,12码', '50', '2', '1.1', '0');
INSERT INTO `bbx_goods` VALUES ('97d84750943511e6af8813c62e2e5fd7', 'Niu 红色,14码', 'Niu 红色,14码', '100', '11', '10', '0', '', '', '2016-10-17 06:47:38', 'Niu1000', 'Niu', '97d2c910943511e6af8813c62e2e5fd7', '红色,14码', '11', '14', '11', '0');
INSERT INTO `bbx_goods` VALUES ('a879fad0943611e6af8813c62e2e5fd7', '123 红色,25码', '123 红色,25码', '12', '11', '11', null, null, null, '2016-10-17 07:03:28', '12', '111', 'a86c6640943611e6af8813c62e2e5fd7', '红色,25码', '1', '2', '11', '0');
INSERT INTO `bbx_goods` VALUES ('c8c3f4908f8011e6ad12f76ab5cdbfa1', '我的商品 红色,12码', '我的商品 红色,12码', '1', '1.1', '1', '0', '', '', '2016-10-11 07:03:17', 'MY1100', 'MY11011', 'c8be4f408f8011e6ad12f76ab5cdbfa1', '红色,12码', '50', '2', '1.1', '0');
INSERT INTO `bbx_goods` VALUES ('ebe64070943211e69c1403dfb91ad445', '巧克力 紫色,12码', '巧克力 紫色,12码', '10', '11', '10', '0', '', '', '2016-10-17 06:28:31', 'QK1000', 'QK1000P', 'ebe025f0943211e69c1403dfb91ad445', '紫色,12码', '100', '120', '11', '0');

-- ----------------------------
-- Table structure for bbx_goods4filterconfig
-- ----------------------------
DROP TABLE IF EXISTS `bbx_goods4filterconfig`;
CREATE TABLE `bbx_goods4filterconfig` (
  `Id` varchar(50) NOT NULL,
  `GoodsId` varchar(50) DEFAULT NULL,
  `GoodsFilterTitle` varchar(50) DEFAULT NULL,
  `GoodsFilterConfig` varchar(500) DEFAULT NULL,
  `GoodsGroupId` varchar(50) DEFAULT NULL,
  `Sort` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`Id`),
  KEY `GoodsId` (`GoodsId`) USING BTREE,
  KEY `GoodsGroupId` (`GoodsGroupId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

-- ----------------------------
-- Records of bbx_goods4filterconfig
-- ----------------------------
INSERT INTO `bbx_goods4filterconfig` VALUES ('069f43408f8211e69e4b3ddcf5f6e603', '', '尺码', '32码', '05f213508f8211e69e4b3ddcf5f6e603', '2');
INSERT INTO `bbx_goods4filterconfig` VALUES ('06a907408f8211e69e4b3ddcf5f6e603', '', '颜色', '黄色', '05f213508f8211e69e4b3ddcf5f6e603', '1');
INSERT INTO `bbx_goods4filterconfig` VALUES ('4b5540d08ed711e69a46e996b4e35937', '', '尺码', '18码', '4b38df308ed711e69a46e996b4e35937', '2');
INSERT INTO `bbx_goods4filterconfig` VALUES ('4b5f2be08ed711e69a46e996b4e35937', '', '颜色', '深紫色', '4b38df308ed711e69a46e996b4e35937', '1');
INSERT INTO `bbx_goods4filterconfig` VALUES ('87bc26b08ed211e6ab43150b992cbf23', '', '尺码', '12码', '87a7b4508ed211e6ab43150b992cbf23', '2');
INSERT INTO `bbx_goods4filterconfig` VALUES ('87c65fe08ed211e6ab43150b992cbf23', '', '颜色', '深蓝色', '87a7b4508ed211e6ab43150b992cbf23', '1');
INSERT INTO `bbx_goods4filterconfig` VALUES ('97dd9e80943511e6af8813c62e2e5fd7', '', '尺码', '14码', '97d2c910943511e6af8813c62e2e5fd7', '2');
INSERT INTO `bbx_goods4filterconfig` VALUES ('97e2a790943511e6af8813c62e2e5fd7', '', '颜色', '红色', '97d2c910943511e6af8813c62e2e5fd7', '1');
INSERT INTO `bbx_goods4filterconfig` VALUES ('a2672ff095cb11e69a0059149d76df65', '', '尺码', '13码', '7be1baa0943411e6ab34ff56e73715cf', '2');
INSERT INTO `bbx_goods4filterconfig` VALUES ('a26b9cc095cb11e69a0059149d76df65', '', '颜色', '酒红色', '7be1baa0943411e6ab34ff56e73715cf', '1');
INSERT INTO `bbx_goods4filterconfig` VALUES ('c8693a508f9411e68152775abe482748', '', '尺码', '15码', '799371308ecb11e693bd1beeb29b91b8', '2');
INSERT INTO `bbx_goods4filterconfig` VALUES ('c86d80108f9411e68152775abe482748', '', '颜色', '红色', '799371308ecb11e693bd1beeb29b91b8', '1');
INSERT INTO `bbx_goods4filterconfig` VALUES ('c8c8d6908f8011e6ad12f76ab5cdbfa1', '', '尺码', '12码', 'c8be4f408f8011e6ad12f76ab5cdbfa1', '2');
INSERT INTO `bbx_goods4filterconfig` VALUES ('c8cd6a708f8011e6ad12f76ab5cdbfa1', '', '颜色', '红色', 'c8be4f408f8011e6ad12f76ab5cdbfa1', '1');
INSERT INTO `bbx_goods4filterconfig` VALUES ('cdbbd510943711e6ac2da3a715bb5afc', '', '尺码', '25码', 'a86c6640943611e6af8813c62e2e5fd7', '2');
INSERT INTO `bbx_goods4filterconfig` VALUES ('cdc23db0943711e6ac2da3a715bb5afc', '', '颜色', '红色', 'a86c6640943611e6af8813c62e2e5fd7', '1');
INSERT INTO `bbx_goods4filterconfig` VALUES ('ebedba80943211e69c1403dfb91ad445', '', '尺码', '12码', 'ebe025f0943211e69c1403dfb91ad445', '2');
INSERT INTO `bbx_goods4filterconfig` VALUES ('ebf50d80943211e69c1403dfb91ad445', '', '颜色', '紫色', 'ebe025f0943211e69c1403dfb91ad445', '1');

-- ----------------------------
-- Table structure for bbx_goods4orders
-- ----------------------------
DROP TABLE IF EXISTS `bbx_goods4orders`;
CREATE TABLE `bbx_goods4orders` (
  `Id` varchar(100) NOT NULL,
  `GoodsId` varchar(100) DEFAULT NULL,
  `OrderId` varchar(100) DEFAULT NULL,
  `GoodsTitle` varchar(100) DEFAULT NULL,
  `GoodsSubtitle` varchar(200) DEFAULT NULL,
  `GoodsImgPath` varchar(200) DEFAULT NULL,
  `GoodsSalePrice` float DEFAULT NULL,
  `GoodsCostPrice` float DEFAULT NULL,
  `GoodsNumber` varchar(50) DEFAULT NULL,
  `GoodsNum` int(11) DEFAULT NULL,
  `CreateTime` datetime DEFAULT NULL,
  `GoodsFilterConfig` varchar(200) DEFAULT NULL,
  `Outeriid` varchar(255) DEFAULT NULL,
  `Skuid` varchar(255) DEFAULT NULL,
  `Buyip` varchar(100) DEFAULT NULL,
  `AgentCode` int(11) NOT NULL DEFAULT '0' COMMENT '分销商编号',
  `ExpressId` varchar(50) DEFAULT NULL COMMENT '快递Id',
  `GoodsGroupId` varchar(45) DEFAULT NULL,
  `GoodsSaleType` int(20) DEFAULT '0' COMMENT '商品类型 1表示积分 0 表示现金',
  `GoodsSalePoints` int(11) DEFAULT NULL COMMENT '商品销售积分',
  `Remarks` varchar(255) DEFAULT NULL COMMENT '商品备注',
  PRIMARY KEY (`Id`),
  KEY `OrderId` (`OrderId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of bbx_goods4orders
-- ----------------------------
INSERT INTO `bbx_goods4orders` VALUES ('00166790912311e6b71e5f721e0ba2a5', '799d5c408ecb11e693bd1beeb29b91b8', 'ffbf6df0912211e6b71e5f721e0ba2a5', '京城21 红色,15码', null, 'http://res1.bbxvip.com/2016-10-10/756d95408ecb11e693bd1beeb29b91b8.png', '1', '1', null, '2', '2016-10-13 16:56:59', '红色,15码', 'JC1001', 'JC10010', null, '0', null, '799371308ecb11e693bd1beeb29b91b8', '0', null, null);
INSERT INTO `bbx_goods4orders` VALUES ('2ab2cd30912411e6b71e5f721e0ba2a5', '4b4255108ed711e69a46e996b4e35937', '2a935e50912411e6b71e5f721e0ba2a5', '111 深紫色,18码', null, 'http://res1.bbxvip.com/2016-10-10/483822508ed711e69a46e996b4e35937.png', '1.1', '11', '', '1', '2016-10-13 17:05:20', '深紫色,18码', '1111', '11111111', null, '0', null, '4b38df308ed711e69a46e996b4e35937', '0', null, null);
INSERT INTO `bbx_goods4orders` VALUES ('7eeb9920911c11e6b26103091b72bbd9', '87b262b08ed211e6ab43150b992cbf23', '7971ed00911c11e6b26103091b72bbd9', '管理员添加 深蓝色,12码', null, 'http://res1.bbxvip.com/2016-10-10/80ec39608ed211e6ab43150b992cbf23.png', '1.1', '1', '', '1', '2016-10-13 16:10:26', '深蓝色,12码', 'GL1001', 'GL1001', null, '0', null, '87a7b4508ed211e6ab43150b992cbf23', '0', null, null);

-- ----------------------------
-- Table structure for bbx_goodscategory
-- ----------------------------
DROP TABLE IF EXISTS `bbx_goodscategory`;
CREATE TABLE `bbx_goodscategory` (
  `Id` varchar(100) NOT NULL,
  `CategoryTitle` varchar(100) DEFAULT NULL,
  `CategorySort` int(11) DEFAULT NULL,
  `CategoryPid` varchar(100) DEFAULT NULL,
  `CategoryIsShow` int(11) DEFAULT NULL,
  `CategoryTree` varchar(200) DEFAULT NULL,
  `CreateTime` datetime DEFAULT NULL,
  `CategoryDeep` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Id` (`Id`) USING BTREE,
  UNIQUE KEY `CategorySort` (`CategorySort`) USING BTREE,
  KEY `CategoryTree` (`CategoryTree`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

-- ----------------------------
-- Records of bbx_goodscategory
-- ----------------------------
INSERT INTO `bbx_goodscategory` VALUES ('11', '食品', '1', '0', '1', '1,1800,1', '2016-10-09 17:12:17', '1');

-- ----------------------------
-- Table structure for bbx_goodsgroup
-- ----------------------------
DROP TABLE IF EXISTS `bbx_goodsgroup`;
CREATE TABLE `bbx_goodsgroup` (
  `Id` varchar(50) NOT NULL,
  `GoodsGroupTitle` varchar(200) DEFAULT NULL,
  `GoodsGroupSubTitle` varchar(200) DEFAULT NULL,
  `GoodsDetail` text,
  `CreateTime` datetime DEFAULT NULL,
  `GoodsImgPath` varchar(200) DEFAULT NULL,
  `GoodsPrice` decimal(6,2) NOT NULL DEFAULT '1000.00',
  `CategoryId` varchar(50) DEFAULT NULL,
  `BrandId` varchar(50) DEFAULT NULL,
  `Outeriid` varchar(50) DEFAULT NULL,
  `Tag` smallint(6) DEFAULT '0',
  `ExpressFee` tinyint(4) NOT NULL DEFAULT '0' COMMENT '快递费',
  `State` tinyint(4) DEFAULT '1',
  `GoodsSaleState` tinyint(4) DEFAULT '0' COMMENT '状态为 0（未上架）改为 1（可销售）',
  `UpdateTime` datetime DEFAULT NULL,
  `IsDelete` tinyint(4) DEFAULT '0' COMMENT '1：删除，0：未删除',
  `GoodsSalePrice` decimal(6,2) DEFAULT NULL,
  `OffComment` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Outeriid` (`Outeriid`) USING BTREE,
  KEY `BrandId` (`BrandId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

-- ----------------------------
-- Records of bbx_goodsgroup
-- ----------------------------
INSERT INTO `bbx_goodsgroup` VALUES ('05f213508f8211e69e4b3ddcf5f6e603', '巧克力', '巧克力', '巧克力', '2016-10-11 15:12:08', 'http://res1.bbxvip.com/2016-10-11/fd61d8608f8111e69e4b3ddcf5f6e603.png', '1.00', '11', null, 'QK', '1', '0', '1', '1', '2016-10-11 15:12:08', '0', null, null);
INSERT INTO `bbx_goodsgroup` VALUES ('4b38df308ed711e69a46e996b4e35937', '111', '111', '11111111111111', '2016-10-10 18:50:00', 'http://res1.bbxvip.com/2016-10-10/483822508ed711e69a46e996b4e35937.png', '11.00', '11', null, '1111', '0', '0', '1', '1', '2016-10-10 18:50:00', '0', '1.00', null);
INSERT INTO `bbx_goodsgroup` VALUES ('799371308ecb11e693bd1beeb29b91b8', '京城21', '京城21', '\n                                                        \n                                                        \n                                                        \n                                                        内容dd\n                                                    \n                                                    ', '2016-10-10 17:25:24', 'http://res1.bbxvip.com/2016-10-10/756d95408ecb11e693bd1beeb29b91b8.png', '1.00', '11', null, 'JC1001', '0', '0', '2', '1', '2016-10-11 17:26:24', '0', '1.00', null);
INSERT INTO `bbx_goodsgroup` VALUES ('7be1baa0943411e6ab34ff56e73715cf', '羊肉', '羊肉', '\n                                                        \n                                                        凤飞飞\n\n                                                    \n                                                    \n                                                    ', '2016-10-17 14:39:41', 'http://res1.bbxvip.com/2016-10-17/77a410f0943411e6ab34ff56e73715cf.png', '100.00', '11', null, 'YR1000', '0', '0', '2', '1', '2016-10-19 15:14:11', '0', null, null);
INSERT INTO `bbx_goodsgroup` VALUES ('87a7b4508ed211e6ab43150b992cbf23', '管理员添加', '管理员添加', '管理员添加', '2016-10-10 18:15:54', 'http://res1.bbxvip.com/2016-10-10/80ec39608ed211e6ab43150b992cbf23.png', '1.00', '11', null, 'GL1001', '0', '0', '1', '1', '2016-10-10 18:15:54', '0', '1.00', null);
INSERT INTO `bbx_goodsgroup` VALUES ('97d2c910943511e6af8813c62e2e5fd7', 'Niu', 'Niu', 'sdfdsfsdf', '2016-10-17 14:47:38', 'http://res1.bbxvip.com/2016-10-17/945429a0943511e6af8813c62e2e5fd7.png', '100.00', '11', null, 'Niu1000', '0', '0', '1', '0', '2016-10-17 14:47:38', '0', null, null);
INSERT INTO `bbx_goodsgroup` VALUES ('a86c6640943611e6af8813c62e2e5fd7', '123', '123', '\n                                                        \n                                                        \n                                                        wesdfs\n                                                    \n                                                    \n                                                    ', '2016-10-17 14:55:15', 'http://res1.bbxvip.com/2016-10-17/a54b7730943611e6af8813c62e2e5fd7.png', '12.00', '11', null, '12', '0', '0', '2', '1', '2016-10-17 15:03:27', '0', null, null);
INSERT INTO `bbx_goodsgroup` VALUES ('c8be4f408f8011e6ad12f76ab5cdbfa1', '我的商品', '我的商品', '打发斯蒂芬\n\n                                                    ', '2016-10-11 15:03:15', 'http://res1.bbxvip.com/2016-10-11/c55840e08f8011e6ad12f76ab5cdbfa1.png', '1.00', '11', null, 'MY1100', '0', '0', '1', '0', '2016-10-11 15:03:15', '0', null, null);
INSERT INTO `bbx_goodsgroup` VALUES ('ebe025f0943211e69c1403dfb91ad445', '巧克力', '巧克力', '醇香\n\n                                                    ', '2016-10-17 14:28:30', 'http://res1.bbxvip.com/2016-10-17/e39ea740943211e69c1403dfb91ad445.png', '10.00', '11', null, 'QK1000', '1', '0', '1', '1', '2016-10-17 14:28:30', '0', null, null);

-- ----------------------------
-- Table structure for bbx_goodsimages
-- ----------------------------
DROP TABLE IF EXISTS `bbx_goodsimages`;
CREATE TABLE `bbx_goodsimages` (
  `Id` varchar(50) NOT NULL,
  `GoodsImgPath` varchar(200) DEFAULT NULL,
  `GoodsId` varchar(50) DEFAULT NULL,
  `CreateTime` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Id` (`Id`) USING BTREE,
  KEY `GoodsId` (`GoodsId`) USING BTREE,
  CONSTRAINT `bk_1` FOREIGN KEY (`GoodsId`) REFERENCES `bbx_goodsgroup` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

-- ----------------------------
-- Records of bbx_goodsimages
-- ----------------------------
INSERT INTO `bbx_goodsimages` VALUES ('06e881408f8211e69e4b3ddcf5f6e603', 'http://res1.bbxvip.com/2016-10-11/fd61d8608f8111e69e4b3ddcf5f6e603.png', '05f213508f8211e69e4b3ddcf5f6e603', '2016-10-11 07:12:09');
INSERT INTO `bbx_goodsimages` VALUES ('4b68c8d08ed711e69a46e996b4e35937', 'http://res1.bbxvip.com/2016-10-10/483822508ed711e69a46e996b4e35937.png', '4b38df308ed711e69a46e996b4e35937', '2016-10-10 10:50:01');
INSERT INTO `bbx_goodsimages` VALUES ('87cf87a08ed211e6ab43150b992cbf23', 'http://res1.bbxvip.com/2016-10-10/80ec39608ed211e6ab43150b992cbf23.png', '87a7b4508ed211e6ab43150b992cbf23', '2016-10-10 10:15:55');
INSERT INTO `bbx_goodsimages` VALUES ('97e71460943511e6af8813c62e2e5fd7', 'http://res1.bbxvip.com/2016-10-17/945429a0943511e6af8813c62e2e5fd7.png', '97d2c910943511e6af8813c62e2e5fd7', '2016-10-17 06:47:38');
INSERT INTO `bbx_goodsimages` VALUES ('a27846f095cb11e69a0059149d76df65', 'http://res1.bbxvip.com/2016-10-17/77a410f0943411e6ab34ff56e73715cf.png', '7be1baa0943411e6ab34ff56e73715cf', '2016-10-19 07:14:12');
INSERT INTO `bbx_goodsimages` VALUES ('c875e4808f9411e68152775abe482748', 'http://res1.bbxvip.com/2016-10-10/756d95408ecb11e693bd1beeb29b91b8.png', '799371308ecb11e693bd1beeb29b91b8', '2016-10-11 09:26:26');
INSERT INTO `bbx_goodsimages` VALUES ('c8d225608f8011e6ad12f76ab5cdbfa1', 'http://res1.bbxvip.com/2016-10-11/c55840e08f8011e6ad12f76ab5cdbfa1.png', 'c8be4f408f8011e6ad12f76ab5cdbfa1', '2016-10-11 07:03:17');
INSERT INTO `bbx_goodsimages` VALUES ('cdcb6570943711e6ac2da3a715bb5afc', 'http://res1.bbxvip.com/2016-10-17/a54b7730943611e6af8813c62e2e5fd7.png', 'a86c6640943611e6af8813c62e2e5fd7', '2016-10-17 07:03:28');
INSERT INTO `bbx_goodsimages` VALUES ('ebfc3970943211e69c1403dfb91ad445', 'http://res1.bbxvip.com/2016-10-17/e39ea740943211e69c1403dfb91ad445.png', 'ebe025f0943211e69c1403dfb91ad445', '2016-10-17 06:28:31');

-- ----------------------------
-- Table structure for bbx_mainlooperad
-- ----------------------------
DROP TABLE IF EXISTS `bbx_mainlooperad`;
CREATE TABLE `bbx_mainlooperad` (
  `Id` varchar(50) NOT NULL,
  `Title` varchar(100) DEFAULT NULL,
  `AppImageUrl` varchar(100) DEFAULT NULL,
  `PcImageUrl` varchar(100) DEFAULT NULL,
  `RedirectUrl` varchar(100) DEFAULT NULL,
  `CreateTime` datetime DEFAULT NULL,
  `AdSort` int(11) DEFAULT NULL,
  `AdType` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of bbx_mainlooperad
-- ----------------------------
INSERT INTO `bbx_mainlooperad` VALUES ('e9384159-95dc-11e6-a6ec-52543bd4f167', '最美服装', 'http://mbbxvip.oss-cn-hangzhou.aliyuncs.com/KJEu-P6KV8fnBCPfYQAwCodc.jpg', null, 'http://www.forke.cn/', '2016-10-19 17:17:51', '1', '1');

-- ----------------------------
-- Table structure for bbx_member
-- ----------------------------
DROP TABLE IF EXISTS `bbx_member`;
CREATE TABLE `bbx_member` (
  `Id` varchar(100) NOT NULL,
  `MemberAccount` varchar(100) DEFAULT NULL,
  `MemberPass` varchar(100) DEFAULT NULL,
  `MemberState` int(11) DEFAULT NULL,
  `CreateTime` datetime DEFAULT NULL,
  `MemberIden` int(11) DEFAULT NULL,
  `HeaderImage` varchar(250) DEFAULT NULL,
  `MemberTitle` varchar(45) DEFAULT NULL,
  `Birthday` date DEFAULT NULL,
  `MemberName` varchar(120) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Id` (`Id`),
  KEY `MemberAccount` (`MemberAccount`,`MemberPass`,`MemberState`,`MemberIden`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of bbx_member
-- ----------------------------
INSERT INTO `bbx_member` VALUES ('bb31766739ee132a9f24e1cbb867b33f', '18655457505', '13ae6fcab6172fb125789cfec2a4e10f', '1', '2015-11-06 20:31:50', '1', 'http://mbbxvip.oss-cn-hangzhou.aliyuncs.com/ZBHna9Sr_cJcTX4ZYYlcZ-5r.jpeg', null, null, 'zzsun');

-- ----------------------------
-- Table structure for bbx_memberinfo
-- ----------------------------
DROP TABLE IF EXISTS `bbx_memberinfo`;
CREATE TABLE `bbx_memberinfo` (
  `Id` varchar(100) NOT NULL,
  `MemberName` varchar(100) DEFAULT NULL,
  `Birthday` date DEFAULT NULL,
  `MemberTitle` varchar(100) DEFAULT NULL,
  `UsablePoints` bigint(11) DEFAULT '0',
  `TotalPoints` bigint(20) DEFAULT '0',
  `HeaderImage` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

-- ----------------------------
-- Records of bbx_memberinfo
-- ----------------------------

-- ----------------------------
-- Table structure for bbx_memberoauth
-- ----------------------------
DROP TABLE IF EXISTS `bbx_memberoauth`;
CREATE TABLE `bbx_memberoauth` (
  `Id` varchar(100) NOT NULL,
  `OauthId` varchar(50) DEFAULT NULL,
  `OauthMemberId` varchar(50) DEFAULT NULL,
  `MemberId` varchar(50) DEFAULT NULL,
  `CreateTime` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of bbx_memberoauth
-- ----------------------------

-- ----------------------------
-- Table structure for bbx_orders
-- ----------------------------
DROP TABLE IF EXISTS `bbx_orders`;
CREATE TABLE `bbx_orders` (
  `Id` varchar(100) NOT NULL,
  `MemberId` varchar(100) DEFAULT NULL,
  `OrderProgressState` int(11) DEFAULT NULL,
  `OrderProgressInfo` varchar(100) DEFAULT NULL,
  `OrderCode` varchar(100) DEFAULT NULL,
  `OrderTime` datetime DEFAULT NULL,
  `OrderPayInfo` varchar(100) DEFAULT NULL,
  `GoodsTotalPrice` float DEFAULT NULL,
  `GoodsFreight` float DEFAULT NULL,
  `OrderTotalPrice` float DEFAULT NULL,
  `OrderTotalDiscount` float DEFAULT '0' COMMENT '全部折扣的金额',
  `PaidCode` varchar(100) DEFAULT NULL,
  `CreateTime` datetime DEFAULT NULL,
  `OrderImage` varchar(100) DEFAULT NULL,
  `Orderfrom` varchar(50) DEFAULT NULL,
  `IsDeleted` tinyint(1) DEFAULT '0',
  `Remarks` varchar(255) DEFAULT NULL,
  `AgentId` varchar(50) DEFAULT NULL,
  `MerchantId` int(11) DEFAULT NULL,
  `HasChecked` datetime(1) DEFAULT NULL COMMENT '对账时间',
  PRIMARY KEY (`Id`),
  UNIQUE KEY `OrderCode` (`OrderCode`),
  KEY `MemberId` (`MemberId`),
  KEY `IsDeleted` (`IsDeleted`),
  KEY `CreateTime` (`CreateTime`),
  KEY `OrderProgressState` (`OrderProgressState`),
  KEY `AgentId` (`AgentId`) USING BTREE,
  KEY `PaidCode` (`PaidCode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of bbx_orders
-- ----------------------------
INSERT INTO `bbx_orders` VALUES ('011c8890f0fb11e5a8d800163e005f18', '41c08960d5f711e5b31900163e005f18', '4', '待签收', '201603232127359816', '2016-10-14 16:07:51', '支付宝支付', '38.5', '0', '38.5', '0', '201603232127306574', '2016-03-23 21:27:30', 'http://res1.bbxvip.com/2016-03-21/8ed0e940ef3111e59a0cb99827d02cf9.png', 'web', '0', '', '', '100298', null);
INSERT INTO `bbx_orders` VALUES ('03877e6cf0f311e5b8df00163e005f18', '702f33e2d5f611e588cc00163e005f18', '9', '交易成功', '201603232030231655', '2016-10-14 16:07:38', '支付宝支付', '38.5', '0', '38.5', '0', '201603232030181443', '2016-03-23 20:30:18', 'http://res1.bbxvip.com/2016-03-21/8ed0e940ef3111e59a0cb99827d02cf9.png', 'web', '0', '', '', '100298', null);
INSERT INTO `bbx_orders` VALUES ('2a935e50912411e6b71e5f721e0ba2a5', 'bb31766739ee132a9f24e1cbb867b33f', '1', '待付款', '201610131705206631', '2016-10-13 17:05:20', '微信支付', '1.1', '0', '1.1', '0', '201610131705206631', '2016-10-13 17:05:20', 'http://res1.bbxvip.com/2016-10-10/483822508ed711e69a46e996b4e35937.png', null, '0', '', '', null, null);
INSERT INTO `bbx_orders` VALUES ('7971ed00911c11e6b26103091b72bbd9', '5895c87656ed4bf2840c478a06e81d17', '99', '订单已取消', '201610131610166487', '2016-10-13 16:25:52', '微信支付', '1.1', '0', '1.1', '0', '201610131610166487', '2016-10-13 16:11:00', 'http://res1.bbxvip.com/2016-10-10/80ec39608ed211e6ab43150b992cbf23.png', null, '1', '', '', null, null);
INSERT INTO `bbx_orders` VALUES ('ffbf6df0912211e6b71e5f721e0ba2a5', 'bb31766739ee132a9f24e1cbb867b33f', '1', '待付款', '201610131656589896', '2016-10-13 16:56:59', '微信支付', '2', '0', '2', '0', '201610131656589896', '2016-10-13 16:56:59', 'http://res1.bbxvip.com/2016-10-10/756d95408ecb11e693bd1beeb29b91b8.png', null, '0', '', '', null, null);

-- ----------------------------
-- Table structure for bbx_reminder
-- ----------------------------
DROP TABLE IF EXISTS `bbx_reminder`;
CREATE TABLE `bbx_reminder` (
  `Id` varchar(50) NOT NULL,
  `OrderCode` varchar(50) DEFAULT NULL,
  `MemberId` varchar(50) DEFAULT NULL,
  `ReminderReason` varchar(100) DEFAULT NULL,
  `CreateTime` datetime DEFAULT NULL,
  `UpdateTime` datetime DEFAULT NULL,
  `ReminderRemark` varchar(255) DEFAULT NULL,
  `MerchantId` int(11) DEFAULT NULL,
  `ReplyDesc` varchar(255) DEFAULT NULL,
  `ReplyRole` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `OrderCode` (`OrderCode`) USING BTREE,
  KEY `ReminderReason` (`ReminderReason`) USING BTREE,
  KEY `MerchantId` (`MerchantId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

-- ----------------------------
-- Records of bbx_reminder
-- ----------------------------

-- ----------------------------
-- View structure for bbx_view_goods_list
-- ----------------------------
DROP VIEW IF EXISTS `bbx_view_goods_list`;
CREATE VIEW `bbx_view_goods_list` AS select `g`.`Id` AS `Id`,`g`.`GoodsTitle` AS `GoodsTitle`,`g`.`GoodsShortTitle` AS `GoodsShortTitle`,`g`.`GoodsPrice` AS `GoodsPrice`,`g`.`GoodsCostPrice` AS `GoodsCostPrice`,`g`.`Outeriid` AS `Outeriid`,`g`.`Skuid` AS `Skuid`,`g`.`MaxCount` AS `MaxCount`,`g`.`GoodsSalePrice` AS `GoodsSalePrice`,`g`.`GoodsSupplyPrice` AS `GoodsSupplyPrice`,`g`.`LimitCount` AS `LimitCount`,`g`.`OriginalCount` AS `OriginalCount`,`g`.`FilterConfig` AS `FilterConfig`,`g`.`CreateTime` AS `CreateTime`,`g`.`GoodsNumber` AS `GoodsNumber`,`gg`.`GoodsGroupTitle` AS `GoodsGroupTitle`,`gg`.`GoodsGroupSubTitle` AS `GoodsGroupSubTitle`,`gg`.`Id` AS `GoodsGroupId`,`gg`.`GoodsPrice` AS `GoodsGroupPrice`,`gg`.`CategoryId` AS `CategoryId`,`gg`.`GoodsSaleState` AS `GoodsSaleState`,`g4c`.`CategoryTitle` AS `CategoryTitle`,`gg`.`BrandId` AS `BrandId`,`b`.`BrandTitle` AS `BrandTitle`,`b`.`BrandInfo` AS `BrandInfo`,`b`.`BrandLogo` AS `BrandLogo`,`gg`.`GoodsDetail` AS `GoodsDetail`,`gg`.`GoodsImgPath` AS `GoodsImgPath`,`gg`.`Outeriid` AS `GoodsGroupOuteriid`,`gg`.`ExpressFee` AS `ExpressFee` from (((`bbx_goods` `g` left join `bbx_goodsgroup` `gg` on((`g`.`GoodsGroupId` = `gg`.`Id`))) left join `bbx_brands` `b` on((`b`.`Id` = `gg`.`BrandId`))) left join `bbx_goodscategory` `g4c` on((`gg`.`CategoryId` = `g4c`.`Id`))) ;

-- ----------------------------
-- View structure for bbx_view_goodsgroup_list
-- ----------------------------
DROP VIEW IF EXISTS `bbx_view_goodsgroup_list`;
CREATE VIEW `bbx_view_goodsgroup_list` AS select `a`.`Id` AS `Id`,`a`.`GoodsGroupTitle` AS `GoodsGroupTitle`,`a`.`CategoryId` AS `CategoryId`,`a`.`GoodsDetail` AS `GoodsDetail`,`a`.`Outeriid` AS `Outeriid`,`a`.`GoodsSaleState` AS `GoodsSaleState`,`a`.`GoodsPrice` AS `GoodsPrice`,`a`.`GoodsSalePrice` AS `GoodsSalePrice`,`a`.`GoodsImgPath` AS `GoodsImgPath`,`a`.`State` AS `State`,`a`.`UpdateTime` AS `UpdateTime`,`a`.`CreateTime` AS `CreateTime`,`a`.`Tag` AS `Tag`,`c`.`CategoryTitle` AS `CategoryTitle`,`a`.`OffComment` AS `OffComment` from (`bbx_goodsgroup` `a` left join `bbx_goodscategory` `c` on((`a`.`CategoryId` = `c`.`Id`))) where (`a`.`IsDelete` <> 1) ;

-- ----------------------------
-- View structure for bbx_view_order_list
-- ----------------------------
DROP VIEW IF EXISTS `bbx_view_order_list`;
CREATE VIEW `bbx_view_order_list` AS select `o`.`Id` AS `Id`,`o`.`MemberId` AS `MemberId`,`m`.`MemberAccount` AS `MemberAccount`,`o`.`OrderProgressState` AS `OrderProgressState`,`o`.`OrderProgressInfo` AS `OrderProgressInfo`,`o`.`OrderCode` AS `OrderCode`,`o`.`OrderTime` AS `OrderTime`,`o`.`OrderPayInfo` AS `OrderPayInfo`,`o`.`GoodsTotalPrice` AS `GoodsTotalPrice`,`co`.`ConsigneeMobile` AS `ConsigneeMobile`,`co`.`ConsigneeName` AS `ConsigneeName`,`o`.`GoodsFreight` AS `GoodsFreight`,`o`.`OrderTotalPrice` AS `OrderTotalPrice`,`o`.`PaidCode` AS `PaidCode`,`o`.`CreateTime` AS `CreateTime`,`o`.`OrderImage` AS `OrderImage`,`o`.`Orderfrom` AS `Orderfrom`,`o`.`AgentId` AS `AgentId` from ((`bbxvip`.`bbx_orders` `o` left join `bbxvip`.`bbx_consignee4orders` `co` on((`co`.`Id` = `o`.`Id`))) left join `bbxvip`.`bbx_member` `m` on((`o`.`MemberId` = `m`.`Id`))) ;

-- ----------------------------
-- View structure for bbx_view_order_with_goods_consignee_list_all
-- ----------------------------
DROP VIEW IF EXISTS `bbx_view_order_with_goods_consignee_list_all`;
CREATE VIEW `bbx_view_order_with_goods_consignee_list_all` AS select `o`.`Id` AS `Id`,`o`.`MemberId` AS `MemberId`,`go`.`GoodsTitle` AS `GoodsTitle`,`g`.`GoodsGroupId` AS `GoodsGroupId`,`go`.`GoodsSalePrice` AS `GoodsSalePrice`,`go`.`GoodsCostPrice` AS `GoodsCostPrice`,`go`.`GoodsFilterConfig` AS `GoodsFilterConfig`,`go`.`GoodsNum` AS `GoodsNum`,`go`.`GoodsImgPath` AS `GoodsImgPath`,`m`.`MemberAccount` AS `MemberAccount`,`o`.`OrderProgressState` AS `OrderProgressState`,`o`.`OrderProgressInfo` AS `OrderProgressInfo`,`o`.`OrderCode` AS `OrderCode`,`o`.`OrderTime` AS `OrderTime`,`o`.`OrderPayInfo` AS `OrderPayInfo`,`o`.`GoodsTotalPrice` AS `GoodsTotalPrice`,`c`.`ConsigneeName` AS `ConsigneeName`,`c`.`ConsigneeMobile` AS `ConsigneeMobile`,concat(`c`.`Province`,' ',`c`.`City`,' ',`c`.`County`,' ',`c`.`Address`) AS `ConsigneeAddress`,`o`.`OrderTotalPrice` AS `OrderTotalPrice`,`o`.`OrderTotalDiscount` AS `OrderTotalDiscount`,`o`.`CreateTime` AS `CreateTime`,`o`.`Orderfrom` AS `Orderfrom`,`o`.`IsDeleted` AS `IsDeleted`,`o`.`Remarks` AS `Remarks`,`go`.`Outeriid` AS `Outeriid`,`go`.`Skuid` AS `Skuid` from ((((`bbx_orders` `o` left join `bbx_goods4orders` `go` on((`go`.`OrderId` = `o`.`Id`))) left join `bbx_member` `m` on((`o`.`MemberId` = `m`.`Id`))) left join `bbx_consignee4orders` `c` on((`c`.`Id` = `o`.`Id`))) left join `bbx_goods` `g` on((`g`.`Id` = `go`.`GoodsId`))) ;
