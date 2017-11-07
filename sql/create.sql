-- 用户表
CREATE TABLE `fastfood_user` (
  `id` int not null AUTO_INCREMENT COMMENT 'ID',
  `openid` varchar(64) not null COMMENT '微信小程序 openid',
  `avatar_url` varchar(512) not null COMMENT '头像地址',
  `nickname` varchar(64) not null COMMENT '微信昵称',
  `password` varchar(64) not null COMMENT '密码',
  `gender` int(1) not null COMMENT '性别',
  `register_time` datetime not null COMMENT '注册时间',
  `last_login_time` datetime not null COMMENT '最近登录时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT = '用户表';

-- 当月菜单表
CREATE TABLE `fastfood_product` (
  `id` int not null AUTO_INCREMENT COMMENT 'ID',
  `name` varchar(64) not null COMMENT '菜式名称',
  `category` varchar(20) COMMENT '所属类别',
  `price` decimal not null COMMENT '价格',
  `part_of_month` int(1) default 0 COMMENT '类别为每旬菜式时，1-上旬，2-中旬，3-下旬，0-都提供',
  `day_of_week` int(1) default 0 COMMENT '一星期中某日才提供的菜式，1-7 分别为周一到周日，0为都提供',
  `spicy` int(1) default 0 COMMENT '1-辣，0-不辣',
  `valid` int(1) default 1 COMMENT '是否有效',
  `create_time` datetime not null COMMENT '创建时间',
  `update_time` datetime not null COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT = '菜单表';

-- 订单表
CREATE TABLE `fastfood_order` (
  `id` int not null AUTO_INCREMENT COMMENT 'ID',
  `user_id` int not null COMMENT '用户 ID',
  `product_id` int COMMENT '菜式 ID',
  `product_name` varchar(64) not null COMMENT '菜式名称',
  `product_category` varchar(20) not null COMMENT '所属类别',
  `price` decimal not null COMMENT '单价',
  `quantity` int(4) not null COMMENT '数量',
  `total_price` decimal not null COMMENT '总价',
  `create_time` datetime not null COMMENT '创建时间',
  `update_time` datetime not null COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT = '订单表';

-- 团订单表
create table `fastfood_group` (
  `id` int not null AUTO_INCREMENT COMMENT 'ID',
  `composer_user_id` int not null COMMENT '发起人ID',
  `due_time` datetime COMMENT '截止时间',
  `name` varchar(32) COMMENT '组团名称',
  `status` int(1) not null default 1 COMMENT '团状态',
  `create_time` datetime not null COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT = '组团表';

-- 团订单与订单关联表
create table `fastfood_group_order` (
  `id` int not null AUTO_INCREMENT COMMENT 'ID',
  `group_id` int not null COMMENT '团id',
  `order_id` int not null COMMENT '订单id',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT = '团订单关联表';
