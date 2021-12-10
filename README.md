启动指令 npm run dev


列表页结构
```html
<div id="RepairList">
    <div class="list-container">
        <div class="title-container"></div>
        <div class="tabs-container colorful"></div>
        <div class="search-container"></div>
        <div class="table-container"></div>
        <div class="paging-container"></div>
    </div>
    <template class="modal-container">
        <a-modal v-model="modelShow" title="" class="" :after-close='handleModelClose'>
            <div class="modal-content">
                <div class="form-item">
                    <div class="key"></div>
                    <div class="value"></div>
                </div>
            </div>
        </a-modal>
    </template>
</div>
```