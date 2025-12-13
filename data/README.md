# 数据说明

在本目录中，可以通过[meta_data.json](meta_data.json)查阅涉及到的所有元数据字段的统计口径，以及一位代表性开发者 afc163 的数据样例展示。每位拥有报告的开发者的数据都以一份 json 文件的形式上传至 oss，并提供开放接口：

- 报告的数据根地址为： https://oss.open-digger.cn/antgroup/oss_dev_report_2025/
- 本次所有拥有报告的开发者名单：https://oss.open-digger.cn/antgroup/oss_dev_report_2025/_logins.json
- 开发者数据地址： https://oss.open-digger.cn/antgroup/oss_dev_report_2025/{login}.json，其中 login 为用户登录名 toLower 后的名称。
- 开发者单项数据格式及说明（同 meta_data 文件）： https://oss.open-digger.cn/antgroup/oss_dev_report_2025/_meta_data.json，该文件中 fileds 字段中列出了所有字段的名称、类型、说明，字段顺序为在报告页面中数据的出现顺序。


## 哪些人会拥有报告？
在 2025 在蚂蚁的开源项目中参与了 Issue/PR 协作的开发者。


## 贡献度和段位的统计方法？

贡献度的计算方式来自于 [OpenRank 统计算法](https://open-digger.cn/docs/user_docs/metrics/community_openrank)，是一种基于 Issue 与 PR 协作的图模型算法。

## 关键词如何获得？

WIP

## 可能存在的数据缺失
1. 只能统计到 Public 仓库状态下的开发者行为
2. GitHub Events API 重构造成的数据缺失问题
