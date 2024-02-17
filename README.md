# 浩万 商城

#### 分支提交规则

```c
    feature 修改bug
    dev 测试
    release 预防
    main 正式

    上线的时候main只能从release代码合并过来
    dev永远不能合并到main和release中(里面的代码很乱只用来测试)
    其他分支正常合并代码是 其他分支->feature->release->main
    需要上到测试服  其他分支-> dev

    注意 代码合并功能上线完成了分支尽量删掉
```
