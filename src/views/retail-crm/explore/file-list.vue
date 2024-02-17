<template>
    <div id="file-list" class="list-container">
        <div class="left">
            <div class="title-container">
                <div class="title-area">{{ $t(/* 文件 */ 'f.file') }}</div>
            </div>

            <div class="file-box">
                <div class="search-item">
                    <!-- 搜索文件 -->
                    <a-input
                        :placeholder="$t(/* 搜索文件 */ 's.search_place')"
                        v-model:value="searchName"
                        @pressEnter="searchCity"
                    />
                    <a-button type="primary" @click="searchCity">{{ $t(/* 搜索 */ 'def.search_se') }}</a-button>
                </div>

                <div class="directory">
                    <div class="title">{{ $t(/* 目录  */ 'retail.directory') }}</div>
                    <addDirectory />
                </div>

                <div class="file-explore-box">
                    <div
                        class="explore-list"
                        :class="{ 'explore-list-click': index === 3 }"
                        v-for="(fileItem, index) in fileListNow"
                        :key="fileItem.id"
                        @contextmenu.prevent="showContextMenu(fileItem, index, $event, 'file')"
                        @click="fileItemSelect(fileItem.id)"
                    >
                        <div class="file-left">
                            <img src="../../../assets/images/retail/manual.png" class="file-img" alt="" />
                            <a-tooltip placement="top" :title="fileItem.fileName">
                                <div class="name-box" v-if="!fileItem.isInputName">{{ fileItem.fileName }}</div>
                                <a-input
                                    v-else
                                    class="name-box name-input"
                                    v-focus
                                    :placeholder="$t('s.search_place')"
                                    v-model:value="fileItemCon.name"
                                    @blur="blurFileName"
                                />
                            </a-tooltip>
                        </div>
                        <div class="file-right">
                            <img :src="fileItem.img" class="people-img" alt="" />
                            <div class="people-name">{{ fileItem.peopleName }}</div>
                            <div class="time">{{ fileItem.time }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div style="flex: 1">
            <div class="title-container">
                <div class="title-area">
                    {{ $t(/* 目录 */ 'n.content') }}
                    <span class="title-text">右键可重命名和删除</span>
                </div>
                <div class="btns-area">
                    <a-button type="primary" ghost>{{ $t('retail.add_content') }}</a-button>
                </div>
            </div>
            <!-- 文件内容 -->
            <div class="file-content">
                <div
                    class="content-list"
                    v-for="(contentItem, index) in fileContentList"
                    @contextmenu.prevent="showContextMenu(contentItem, index, $event, 'content')"
                >
                    <div class="img-box">
                        <img class="content-item-img" src="../../../assets/images/retail/book.png" alt="" />

                        <div class="to-top-img">
                            <a-tooltip placement="top" :title="$t('retail.to_top')" v-if="true">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                >
                                    <path
                                        fill-rule="evenodd"
                                        clip-rule="evenodd"
                                        d="M10.9091 7.66683L8.66683 7.66683L8.66683 14.3335L7.33349 14.3335L7.33349 7.66683L5.09124 7.66683C4.8012 7.66683 4.64954 7.32206 4.84552 7.10825L7.75444 3.93489C7.88655 3.79076 8.11376 3.79076 8.24588 3.93489L11.1548 7.10825C11.3508 7.32206 11.1991 7.66683 10.9091 7.66683ZM14.3335 3.00016L14.3335 1.66683L1.66683 1.66683L1.66683 3.00016L14.3335 3.00016Z"
                                        fill="#86909C"
                                    />
                                </svg>
                            </a-tooltip>

                            <a-tooltip placement="top" :title="$t('retail.cancle_top')" v-else>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                >
                                    <g clip-path="url(#clip0_743_22633)">
                                        <rect
                                            y="2.06055"
                                            width="1.5"
                                            height="19.7013"
                                            transform="rotate(-45 0 2.06055)"
                                            fill="#86909C"
                                        />
                                        <path
                                            fill-rule="evenodd"
                                            clip-rule="evenodd"
                                            d="M3.60889 1.6665L14.3335 1.6665L14.3335 2.99984L4.94222 2.99984L3.60889 1.6665ZM3.06966 2.99984L1.73633 1.6665L1.66683 1.6665L1.66683 2.99984L3.06966 2.99984ZM6.85651 4.91412L7.75444 3.93456C7.88655 3.79044 8.11377 3.79044 8.24588 3.93456L11.1548 7.10793C11.3508 7.32173 11.1991 7.6665 10.9091 7.6665L9.60889 7.6665L6.85651 4.91412ZM8.66683 8.597L5.96094 5.89111L4.84552 7.10793C4.64954 7.32173 4.8012 7.6665 5.09124 7.6665L7.3335 7.6665L7.3335 14.3332L8.66683 14.3332L8.66683 8.597Z"
                                            fill="#86909C"
                                        />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_743_22633">
                                            <rect
                                                width="16"
                                                height="16"
                                                fill="white"
                                                transform="matrix(-1 -8.74228e-08 -8.74228e-08 1 16 0)"
                                            />
                                        </clipPath>
                                    </defs>
                                </svg>
                            </a-tooltip>
                        </div>
                    </div>

                    <a-tooltip placement="top" :title="contentItem.fileName">
                        <div class="name-box" v-if="!contentItem.isInputName">{{ contentItem.fileName }}</div>
                        <a-input
                            v-else
                            class="name-box name-input"
                            v-focus
                            :placeholder="$t('s.search_place')"
                            v-model:value="fileContentObj.name"
                            @blur="blurFileContent"
                        />
                    </a-tooltip>

                    <div class="time">{{ contentItem.time }}</div>

                    <div class="content-bottom">
                        <img :src="contentItem.img_peo" class="people-img" alt="" />
                        <div class="people-name">{{ contentItem.peopleName }}</div>
                        <div class="right-click">
                            <a-tooltip placement="top" :title="$t('retail.delete')">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    class="cursor-pointer"
                                >
                                    <path
                                        class="btn"
                                        fill-rule="evenodd"
                                        clip-rule="evenodd"
                                        d="M11.3332 2.99984V1.6665L4.6665 1.66651V2.99984L1.6665 2.99984V4.33317H2.83317L2.83317 13.3332C2.83317 13.8855 3.28089 14.3332 3.83317 14.3332L12.1665 14.3332C12.7188 14.3332 13.1665 13.8855 13.1665 13.3332V4.33317L14.3332 4.33317V2.99984L11.3332 2.99984ZM4.1665 12.9998L4.1665 4.33317L11.8332 4.33317V12.9998L4.1665 12.9998ZM5.99984 5.99984V10.9998H7.33317V5.99984H5.99984ZM8.6665 5.99984V10.9998H9.99984V5.99984H8.6665Z"
                                        fill="#86909C"
                                    />
                                </svg>
                            </a-tooltip>
                            <a-tooltip placement="top" :title="$t('retail.re_name')">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    class="write-name"
                                    @click="writeName"
                                >
                                    <path
                                        class="btn"
                                        fill-rule="evenodd"
                                        clip-rule="evenodd"
                                        d="M9.26625 1.62981C9.65677 1.23928 10.2899 1.23928 10.6805 1.62981L12.5424 3.4917C12.9329 3.88223 12.9329 4.51539 12.5424 4.90592L5.72573 11.7225C5.5666 11.8817 5.35844 11.9825 5.13491 12.0087L3.11926 12.2446C2.49464 12.3178 1.95836 11.803 2.00583 11.1759L2.16504 9.07261C2.18309 8.83416 2.28599 8.61007 2.45508 8.44098L9.26625 1.62981ZM8.76919 4.01248L10.1597 5.40298L11.3638 4.19881L9.97336 2.80832L8.76919 4.01248ZM9.21688 6.34578L7.82638 4.95529L3.48524 9.29643L3.36588 10.8733L4.86483 10.6978L9.21688 6.34578ZM14 14.6664L2 14.6664V13.333L14 13.333V14.6664Z"
                                        fill="#86909C"
                                    />
                                </svg>
                            </a-tooltip>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 右键弹框 -->
        <div
            class="triangle-pop"
            v-if="contextMenuVisible"
            :style="{ top: contextMenuY - 80 + 'px', left: contextMenuX - 220 + 'px' }"
        >
            <div class="sel" @click="renameItem">{{ $t('retail.re_name') }}</div>
            <div class="sel" @click="deleteItem">{{ $t('retail.delete') }}</div>
        </div>
    </div>
</template>

<script>
import addDirectory from './components/add-directory.vue';
export default {
    name: 'StoreList',
    data() {
        return {
            searchName: '',
            contextMenuVisible: false,
            contextMenuX: 0,
            contextMenuY: 0,
            // selectedItemIndex: null,
            isFile: false,
            // 当前要更改的名称
            fileItemCon: {
                name: '',
                id: '',
            },
            fileContentObj: {
                name: '',
                id: '',
            },
            fileList: [
                {
                    fileName: '2.0车辆产品手册产品手册',
                    img: 'https://th.bing.com/th/id/R.796bd6ff4ad52852ca7afdd71cda3d2c?rik=vC5QHkHMk9VHhA&pid=ImgRaw&r=0',
                    peopleName: '李鹏程',
                    time: '2023.12.12 12:56:24',
                    id: 1,
                    isInputName: false,
                },
                {
                    fileName: '2.0车辆产品手册产品手册',
                    img: 'https://th.bing.com/th/id/R.796bd6ff4ad52852ca7afdd71cda3d2c?rik=vC5QHkHMk9VHhA&pid=ImgRaw&r=0',
                    peopleName: '李鹏程',
                    time: '2023.12.12 12:56:24',
                    id: 2,
                    isInputName: false,
                },
                {
                    fileName: '2.0车辆产品手册产品手册',
                    img: 'https://th.bing.com/th/id/R.796bd6ff4ad52852ca7afdd71cda3d2c?rik=vC5QHkHMk9VHhA&pid=ImgRaw&r=0',
                    peopleName: '李鹏程',
                    time: '2023.12.12 12:56:24',
                    id: 3,
                    isInputName: false,
                },
                {
                    fileName: '2.0车辆产品手册产品手册',
                    img: 'https://th.bing.com/th/id/R.796bd6ff4ad52852ca7afdd71cda3d2c?rik=vC5QHkHMk9VHhA&pid=ImgRaw&r=0',
                    peopleName: '李鹏程',
                    time: '2023.12.12 12:56:24',
                    id: 4,
                    isInputName: false,
                },
                {
                    fileName: '2.0车辆产品手册产品手册',
                    img: 'https://th.bing.com/th/id/R.796bd6ff4ad52852ca7afdd71cda3d2c?rik=vC5QHkHMk9VHhA&pid=ImgRaw&r=0',
                    peopleName: '李鹏程',
                    time: '2023.12.12 12:56:24',
                    id: 5,
                    isInputName: false,
                },
            ],
            fileContentList: [
                {
                    fileName: '2.0车辆产品手册产品手册',
                    img: '../../../assets/images/retail/book.png',
                    peopleName: '李鹏程',
                    time: '2023.12.12 12:56:24',
                    id: 1,
                    isInputName: false,
                    img_peo:
                        'https://th.bing.com/th/id/R.796bd6ff4ad52852ca7afdd71cda3d2c?rik=vC5QHkHMk9VHhA&pid=ImgRaw&r=0',
                },
                {
                    fileName: '2.0车辆产品手册产品手册',
                    img: '../../../assets/images/retail/book.png',
                    peopleName: '李鹏程',
                    time: '2023.12.12 12:56:24',
                    id: 2,
                    isInputName: false,
                    img_peo:
                        'https://th.bing.com/th/id/R.796bd6ff4ad52852ca7afdd71cda3d2c?rik=vC5QHkHMk9VHhA&pid=ImgRaw&r=0',
                },
                {
                    fileName: '2.0车辆产品手册产品手册',
                    img: '../../../assets/images/retail/book.png',
                    peopleName: '李鹏程',
                    time: '2023.12.12 12:56:24',
                    id: 3,
                    isInputName: false,
                    img_peo:
                        'https://th.bing.com/th/id/R.796bd6ff4ad52852ca7afdd71cda3d2c?rik=vC5QHkHMk9VHhA&pid=ImgRaw&r=0',
                },
                {
                    fileName: '2.0车辆产品手册产品手册',
                    img: '../../../assets/images/retail/book.png',
                    peopleName: '李鹏程',
                    time: '2023.12.12 12:56:24',
                    id: 4,
                    isInputName: false,
                    img_peo:
                        'https://th.bing.com/th/id/R.796bd6ff4ad52852ca7afdd71cda3d2c?rik=vC5QHkHMk9VHhA&pid=ImgRaw&r=0',
                },
                {
                    fileName: '2.0车辆产品手册产品手册',
                    img: '../../../assets/images/retail/book.png',
                    peopleName: '李鹏程',
                    time: '2023.12.12 12:56:24',
                    id: 5,
                    isInputName: false,
                    img_peo:
                        'https://th.bing.com/th/id/R.796bd6ff4ad52852ca7afdd71cda3d2c?rik=vC5QHkHMk9VHhA&pid=ImgRaw&r=0',
                },
            ],
        };
    },
    watch: {},
    computed: {
        fileListNow() {
            return this.fileList;
        },
    },
    components: {
        addDirectory,
    },
    mounted() {},
    methods: {
        writeName() {
            console.log('write------');
        },

        nameClick() {
            console.log('名称左击');
        },

        showContextMenu(item, index, event, type) {
            console.log('名称右击', item, index, event);
            if (type === 'file') {
                this.fileItemCon.name = item.fileName;
                this.fileItemCon.id = item.id;
                this.isFile = true;
            } else if (type === 'content') {
                this.fileContentObj.name = item.fileName;
                this.fileContentObj.id = item.id;
                this.isFile = false;
            }

            this.contextMenuVisible = true;
            this.contextMenuX = event.clientX;
            this.contextMenuY = event.clientY;
            // this.selectedItemIndex = index;
        },
        // 根据id改变item显示输入框
        UpdateItemById() {
            // 寻找对应id项，给予变更显示input框
            let id;
            if (this.isFile) {
                console.log('删除 ', this.fileItemCon.id);
                id = this.fileItemCon.id;
                this.fileList.forEach(item => {
                    item.id === id ? (item.isInputName = true) : (item.isInputName = false);
                });
            } else {
                id = this.fileContentObj.id;
                console.log('删除 ', this.fileContentObj.id);
                this.fileContentList.forEach(item => {
                    item.id === id ? (item.isInputName = true) : (item.isInputName = false);
                });
            }
        },
        searchCity() {},

        renameItem() {
            this.UpdateItemById();
            this.hideContextMenu();
        },
        deleteItem() {
            if (this.isFile) {
                console.log('删除 ', this.fileItemCon.id);
            } else {
                console.log('删除 ', this.fileContentObj.id);
            }
            this.hideContextMenu();
        },

        hideContextMenu() {
            this.contextMenuVisible = false;
            // this.selectedItemIndex = null;
        },

        blurFileName() {
            this.fileList.forEach(item => {
                item.isInputName = false;
            });
            console.log('视角 ', this.fileList);
        },
        blurFileContent() {
            this.fileContentList.forEach(item => {
                item.isInputName = false;
            });
            console.log('视角 ', this.fileContentList);
        },
        // 选中左边文件项
        fileItemSelect(id) {
            console.log('选中------id', id);
        },
    },
};
</script>

<style lang="less" scoped>
#file-list {
    display: flex;
}

.left {
    width: 512px;
    border-right: 2px solid #f0f0f0;
}
.file-box {
    padding: 0px 26px 20px 22px;
    flex: 1;
    min-height: 700px;
}

.search-item {
    display: flex;
    border: 1px solid var(--color-border-2, #e5e6eb);
    border-radius: 2px;

    .ant-btn {
        border-radius: 2px;
    }
}

.ant-input {
    border: 1px #ffffff solid;
    border-radius: 2px 0px 0px 2px;
}

.directory {
    align-items: center;
    padding: 30px 0px 20px;
    .fj();

    .title {
        color: var(--color-text-1, #1d2129);
        font-size: 16px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
    }
}

.file-explore-box {
    width: 468px;
    height: 600px;
    overflow-y: auto;

    .explore-list {
        // position: relative;
        height: 50px;
        width: 100%;
        background-color: var(--color-fill-1, #f7f8fa);
        margin-bottom: 10px;
        padding: 0 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-sizing: border-box;

        .file-left {
            display: flex;
            align-items: center;
            .file-img {
                width: 24px;
                height: 24px;
            }
            .name-box {
                width: 161px;
                margin-left: 8px;
                box-sizing: border-box;
                color: var(--color-text-1, #1d2129);
                font-size: 14px;
                font-style: normal;
                font-weight: 600;
                line-height: normal;

                overflow: hidden; //超出的文本隐藏
                text-overflow: ellipsis; //溢出用省略号显示
                white-space: nowrap; //溢出不换行
                cursor: pointer;
            }

            .name-input {
                border-radius: 2px;
                border: 1px solid var(--brand-6, #0061ff);
                background: #fff;
            }
        }

        .file-right {
            display: flex;
            align-items: center;
            margin-left: 24px;

            .people-img {
                display: block;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                overflow: hidden;
            }

            .time {
                max-width: 111px;
                color: var(--color-text-3, #86909c);
                font-size: 12px;
                font-style: normal;
                font-weight: 400;
                line-height: normal;
                margin-left: 8px;
            }

            .people-name {
                color: var(--color-text-1, #1d2129);
                font-size: 12px;
                font-style: normal;
                font-weight: 400;
                line-height: normal;
                margin-left: 4px;
            }
        }
    }

    .explore-list:hover {
        background: #e6efff;
    }

    .explore-list-click {
        border-radius: 2px;
        border: 1px solid var(--brand-6, #0061ff);
        background: #e6efff;
    }
}

/* 定义滚动条的宽度和颜色 */
::-webkit-scrollbar {
    width: 5px; /* 宽度 */
    height: 10px;
}

/* 定义滚动条的滑块 */
::-webkit-scrollbar-thumb {
    background-color: #ccc; /* 滑块颜色 */
    border-radius: 5px; /* 滑块圆角 */
}

/* 定义滚动条的轨道 */
::-webkit-scrollbar-track {
    background-color: #f1f1f1; /* 轨道颜色 */
}

.triangle-pop {
    width: 100px;
    position: absolute;
    z-index: 100;
    background-color: rgba(255, 255, 255, 1);
    border-radius: 4px;
    border: 1px solid var(--color-border-2, #e5e6eb);
    box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.1);
    padding-top: 5px;
    cursor: pointer;

    .sel {
        height: 24px;
        line-height: 24px;
        width: 100%;
        text-align: center;
        margin-bottom: 5px;
    }

    .sel:hover {
        background: var(--color-fill-2, #f2f3f5);
    }
}

.title-text {
    color: var(--color-text-3, #86909c);
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    margin-left: 5px;
}
.file-content {
    display: flex;
    padding: 0px 24px;
    flex-wrap: wrap;
    .content-list:hover {
        .to-top-img {
            display: block;
        }
    }
    .content-list {
        width: 212px;
        height: 291px;
        margin: 0px 15px 15px 0px;
        border-radius: 4px;
        border: 1px solid var(--color-border-1, #f2f3f5);
        padding: 12px;
        box-sizing: border-box;

        .img-box {
            position: relative;
        }
        .to-top-img {
            width: 20px;
            height: 20px;
            padding: 2px;
            position: absolute;
            top: 6px;
            right: 6px;
            display: none;
            border-radius: 2px;
        }
        .to-top-img:hover {
            background: #fff;
        }
        .content-item-img {
            width: 188px;
            height: 178px;
        }

        .people-img {
            display: block;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            overflow: hidden;
        }
        .time {
            max-width: 111px;
            color: var(--color-text-3, #86909c);
            font-size: 12px;
            font-style: normal;
            font-weight: 400;
            line-height: 27px;
            height: 27px;
        }
        .name-box {
            color: var(--color-black, #000);
            font-size: 14px;
            font-style: normal;
            font-weight: 600;
            line-height: 20px;
            height: 20px;
            margin-top: 12px;
        }
        .people-name {
            color: var(--color-text-1, #1d2129);
            font-size: 12px;
            font-style: normal;
            font-weight: 400;
            line-height: normal;
            margin-left: 4px;
        }
        .right-click {
            flex: 1;
            display: inline-flex;
            justify-content: flex-end;
        }

        .content-bottom {
            height: 24px;
            display: flex;
            align-items: center;

            .cursor-pointer {
                cursor: pointer;
                margin-left: 8px;
            }
            .cursor-pointer:hover .btn {
                fill: #ff0000; /* 设置悬停时的颜色，这里以红色为例 */
            }
            .write-name {
                cursor: pointer;
                margin-left: 8px;
            }
            .write-name:hover .btn {
                fill: #0061ff; /* 设置悬停时的颜色，这里以红色为例 */
            }
        }
    }
}
</style>
