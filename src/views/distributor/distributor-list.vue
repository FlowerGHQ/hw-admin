<template>
<div id="DistributorList">
    <div class="list-container">
        <div class="title-container">
            <div class="title-area">经销商列表</div>
            <div class="btns-area">
                <a-button type="primary" @click="routerChange('edit')"><i class="icon i_add"/>新建经销商</a-button>
            </div>
        </div>
        <div class="search-container">
            <a-row class="search-area">
                <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                    <div class="key">经销商名称:</div>
                    <div class="value">
                        <a-input placeholder="请输入经销商名称" v-model:value="searchForm.name" @keydown.enter='handleSearch'/>
                    </div>
                </a-col>
                <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                    <div class="key">国家:</div>
                    <div class="value">
                        <a-select placeholder="请选择国家" v-model:value="searchForm.country" @change="handleSearch" show-search option-filter-prop="children" allow-clear>
                            <a-select-option v-for="item in countryList" :key="item.label" :value="item.label">{{item.label}}</a-select-option>
                        </a-select>
                    </div>
                </a-col>
                <a-col :xs='24' :sm='24' :xl="16" :xxl='12' class="search-item">
                    <div class="key">创建时间:</div>
                    <div class="value">
                        <a-range-picker v-model:value="create_time" valueFormat='X' @change="handleSearch" :show-time="defaultTime">
                            <template #suffixIcon><i class="icon i_calendar"></i> </template>
                        </a-range-picker>
                    </div>
                </a-col>
            </a-row>
            <div class="btn-area">
                <a-button @click="handleSearch" type="primary">查询</a-button>
                <a-button @click="handleSearchReset">重置</a-button>
            </div>
        </div>
        <div class="table-container">
            <a-table :columns="tableColumns" :data-source="tableData" :scroll="{ x: true }"
                :row-key="record => record.id"  :pagination='false' @change="handleTableChange">
                <template #bodyCell="{ column, text , record}">
                    <template v-if="column.dataIndex === 'sn'">
                        <a-tooltip placement="top" :title='text'>
                            <a-button type="link" @click="routerChange('detail', record)">{{text}}</a-button>
                        </a-tooltip>
                    </template>
                    <template v-if="column.dataIndex === 'status'">
                        <div class="status status-bg status-tag" :class="$Util.repairStatusFilter(text,'color')">
                            {{$Util.repairStatusFilter(text)}}
                        </div>
                    </template>
                    <template v-if="column.key === 'item'">
                        {{ text || '-'}}
                    </template>
                    <template v-if="column.key === 'tip_item'">
                        <a-tooltip placement="top" :title='text'>
                            <div class="ell" style="max-width: 160px">{{text || '-'}}</div>
                        </a-tooltip>
                    </template>
                    <template v-if="column.key === 'time'">
                        {{ $Util.timeFilter(text) }}
                    </template>
                    <template v-if="column.key === 'operation'">
                        <!-- <a @click="routerChange('edit',record)">修改</a> -->
                        <a @click="routerChange('edit',record)">修改</a>
                    </template>
                    <template v-if="column.key === 'operation'">
                        <a @click="delete(record.id)">删除</a>
                    </template>
                </template>
            </a-table>
        </div>
        <div class="paging-container">
            <a-pagination
                v-model:current="currPage"
                :page-size='pageSize'
                :total="total"
                show-quick-jumper
                show-size-changer
                show-less-items
                :show-total="total => `共${total}条`"
                :hide-on-single-page='false'
                :pageSizeOptions="['10', '20', '30', '40']"
                @change="pageChange"
                @showSizeChange="pageSizeChange"
            />
        </div>
    </div>
</div>
</template>

<script>
import Core from '../../core';
export default {
    name: 'DistributorList',
    components: {},
    props: {},
    data() {
        return {
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
            // 分页
            currPage: 1,
            pageSize: 20,
            total: 0,
            // 搜索
            defaultTime: Core.Const.TIME_PICKER_DEFAULT_VALUE.B_TO_B,
            countryList: [
                {
                    "value":"AA",
                    "label":"America"
                },
                {
                    "value":"AD",
                    "label":"Andorra"
                },
                {
                    "value":"AE",
                    "label":"United Arab Emirates"
                },
                {
                    "value":"AF",
                    "label":"Afghanistan"
                },
                {
                    "value":"AG",
                    "label":"Antigua and Barbuda"
                },
                {
                    "value":"AL",
                    "label":"Albania"
                },
                {
                    "value":"AM",
                    "label":"Armenia"
                },
                {
                    "value":"AO",
                    "label":"Angola"
                },
                {
                    "value":"AR",
                    "label":"Argentina"
                },
                {
                    "value":"AT",
                    "label":"Austria"
                },
                {
                    "value":"AU",
                    "label":"Australia"
                },
                {
                    "value":"AW",
                    "label":"Aruba"
                },
                {
                    "value":"AZ",
                    "label":"Azerbaijan"
                },
                {
                    "value":"BA",
                    "label":"Bosnia and Herzegovina"
                },
                {
                    "value":"BB",
                    "label":"Barbados"
                },
                {
                    "value":"BD",
                    "label":"Bangladesh"
                },
                {
                    "value":"BE",
                    "label":"Belgium"
                },
                {
                    "value":"BF",
                    "label":"Burkina Faso"
                },
                {
                    "value":"BG",
                    "label":"Bulgaria"
                },
                {
                    "value":"BH",
                    "label":"Bahrain"
                },
                {
                    "value":"BI",
                    "label":"Burundi"
                },
                {
                    "value":"BJ",
                    "label":"Benin"
                },
                {
                    "value":"BM",
                    "label":"Bermuda"
                },
                {
                    "value":"BN",
                    "label":"Brunei"
                },
                {
                    "value":"BO",
                    "label":"Bolivia"
                },
                {
                    "value":"BR",
                    "label":"Brazil"
                },
                {
                    "value":"BS",
                    "label":"Bahamas"
                },
                {
                    "value":"BT",
                    "label":"Bhutan"
                },
                {
                    "value":"BW",
                    "label":"Botswana"
                },
                {
                    "value":"BY",
                    "label":"Belarus"
                },
                {
                    "value":"BZ",
                    "label":"Belize"
                },
                {
                    "value":"CA",
                    "label":"Canada"
                },
                {
                    "value":"CD",
                    "label":"Democratic Republic of the Congo"
                },
                {
                    "value":"CF",
                    "label":"Central African Republic"
                },
                {
                    "value":"CG",
                    "label":"Democratic Republic of the Congo"
                },
                {
                    "value":"CH",
                    "label":"Switzerland"
                },
                {
                    "value":"CL",
                    "label":"Chile"
                },
                {
                    "value":"CM",
                    "label":"Cameroon"
                },
                {
                    "value":"CN",
                    "label":"China"
                },
                {
                    "value":"CO",
                    "label":"Colombia"
                },
                {
                    "value":"CR",
                    "label":"Costa Rica"
                },
                {
                    "value":"CU",
                    "label":"Cuba"
                },
                {
                    "value":"CV",
                    "label":"Cape Verde"
                },
                {
                    "value":"CY",
                    "label":"Cyprus"
                },
                {
                    "value":"CZ",
                    "label":"Czech Republic"
                },
                {
                    "value":"DE",
                    "label":"Germany"
                },
                {
                    "value":"DJ",
                    "label":"Djibouti"
                },
                {
                    "value":"DK",
                    "label":"Denmark"
                },
                {
                    "value":"DM",
                    "label":"Dominica"
                },
                {
                    "value":"DO",
                    "label":"Dominican Republic"
                },
                {
                    "value":"DZ",
                    "label":"Algeria"
                },
                {
                    "value":"EC",
                    "label":"Ecuador"
                },
                {
                    "value":"EE",
                    "label":"Estonia"
                },
                {
                    "value":"EG",
                    "label":"Egypt"
                },
                {
                    "value":"ER",
                    "label":"Eritrea"
                },
                {
                    "value":"ES",
                    "label":"Spain"
                },
                {
                    "value":"ET",
                    "label":"Ethiopia"
                },
                {
                    "value":"FI",
                    "label":"Finland"
                },
                {
                    "value":"FJ",
                    "label":"Fiji"
                },
                {
                    "value":"FK",
                    "label":"Falkland Islands"
                },
                {
                    "value":"FM",
                    "label":"Micronesia"
                },
                {
                    "value":"FO",
                    "label":"Faroe Islands"
                },
                {
                    "value":"FR",
                    "label":"France"
                },
                {
                    "value":"GA",
                    "label":"Gabon"
                },
                {
                    "value":"GB",
                    "label":"United Kingdom"
                },
                {
                    "value":"GD",
                    "label":"Grenada"
                },
                {
                    "value":"GE",
                    "label":"Georgia"
                },
                {
                    "value":"GH",
                    "label":"Ghana"
                },
                {
                    "value":"GI",
                    "label":"Gibraltar"
                },
                {
                    "value":"GM",
                    "label":"Gambia"
                },
                {
                    "value":"GN",
                    "label":"Guinea"
                },
                {
                    "value":"GQ",
                    "label":"Equatorial Guinea"
                },
                {
                    "value":"GR",
                    "label":"Greece"
                },
                {
                    "value":"GT",
                    "label":"Guatemala"
                },
                {
                    "value":"GW",
                    "label":"Guinea-Bissau"
                },
                {
                    "value":"GY",
                    "label":"Guyana"
                },
                {
                    "value":"HK",
                    "label":"Hong Kong"
                },
                {
                    "value":"HN",
                    "label":"Honduras"
                },
                {
                    "value":"HR",
                    "label":"Croatia"
                },
                {
                    "value":"HT",
                    "label":"Haiti"
                },
                {
                    "value":"HU",
                    "label":"Hungary"
                },
                {
                    "value":"ID",
                    "label":"Indonesia"
                },
                {
                    "value":"IE",
                    "label":"Ireland"
                },
                {
                    "value":"IL",
                    "label":"Israel"
                },
                {
                    "value":"IN",
                    "label":"India"
                },
                {
                    "value":"IQ",
                    "label":"Iraq"
                },
                {
                    "value":"IR",
                    "label":"Iran"
                },
                {
                    "value":"IS",
                    "label":"Iceland"
                },
                {
                    "value":"IT",
                    "label":"Italy"
                },
                {
                    "value":"JM",
                    "label":"Jamaica"
                },
                {
                    "value":"JO",
                    "label":"Jordan"
                },
                {
                    "value":"JP",
                    "label":"Japan"
                },
                {
                    "value":"KE",
                    "label":"Kenya"
                },
                {
                    "value":"KG",
                    "label":"Kyrgyzstan"
                },
                {
                    "value":"KH",
                    "label":"Cambodia"
                },
                {
                    "value":"KI",
                    "label":"Kiribati"
                },
                {
                    "value":"KM",
                    "label":"Comoros"
                },
                {
                    "value":"KN",
                    "label":"Saint Kitts and Nevis"
                },
                {
                    "value":"KP",
                    "label":"North Korea"
                },
                {
                    "value":"KR",
                    "label":"South Korea"
                },
                {
                    "value":"KW",
                    "label":"Kuwait"
                },
                {
                    "value":"KY",
                    "label":"Cayman Islands"
                },
                {
                    "value":"KZ",
                    "label":"Kazakhstan"
                },
                {
                    "value":"LA",
                    "label":"Laos"
                },
                {
                    "value":"LB",
                    "label":"Lebanon"
                },
                {
                    "value":"LC",
                    "label":"Saint Lucia"
                },
                {
                    "value":"LI",
                    "label":"Liechtenstein"
                },
                {
                    "value":"LK",
                    "label":"Sri Lanka"
                },
                {
                    "value":"LR",
                    "label":"Liberia"
                },
                {
                    "value":"LS",
                    "label":"Lesotho"
                },
                {
                    "value":"LT",
                    "label":"Lithuania"
                },
                {
                    "value":"LU",
                    "label":"Luxembourg"
                },
                {
                    "value":"LV",
                    "label":"Latvia"
                },
                {
                    "value":"LY",
                    "label":"Libya"
                },
                {
                    "value":"MA",
                    "label":"Morocco"
                },
                {
                    "value":"MC",
                    "label":"Monaco"
                },
                {
                    "value":"MD",
                    "label":"Moldova"
                },
                {
                    "value":"ME",
                    "label":"Montenegro"
                },
                {
                    "value":"MG",
                    "label":"Madagascar"
                },
                {
                    "value":"MK",
                    "label":"Macedonia"
                },
                {
                    "value":"ML",
                    "label":"Mali"
                },
                {
                    "value":"MM",
                    "label":"Myanmar"
                },
                {
                    "value":"MN",
                    "label":"Mongolia"
                },
                {
                    "value":"MO",
                    "label":"Macao"
                },
                {
                    "value":"MR",
                    "label":"Mauritania"
                },
                {
                    "value":"MT",
                    "label":"Malta"
                },
                {
                    "value":"MU",
                    "label":"Mauritius"
                },
                {
                    "value":"MV",
                    "label":"Maldives"
                },
                {
                    "value":"MW",
                    "label":"Malawi"
                },
                {
                    "value":"MX",
                    "label":"Mexico"
                },
                {
                    "value":"MY",
                    "label":"Malaysia"
                },
                {
                    "value":"MZ",
                    "label":"Mozambique"
                },
                {
                    "value":"NA",
                    "label":"Namibia"
                },
                {
                    "value":"NE",
                    "label":"Niger"
                },
                {
                    "value":"NG",
                    "label":"Nigeria"
                },
                {
                    "value":"NI",
                    "label":"Nicaragua"
                },
                {
                    "value":"NL",
                    "label":"Netherlands"
                },
                {
                    "value":"NO",
                    "label":"Norway"
                },
                {
                    "value":"NP",
                    "label":"Nepal"
                },
                {
                    "value":"NR",
                    "label":"Nauru"
                },
                {
                    "value":"NZ",
                    "label":"New Zealand"
                },
                {
                    "value":"OM",
                    "label":"Oman"
                },
                {
                    "value":"PA",
                    "label":"Panama"
                },
                {
                    "value":"PE",
                    "label":"Peru"
                },
                {
                    "value":"PG",
                    "label":"Papua New Guinea"
                },
                {
                    "value":"PH",
                    "label":"Philippines"
                },
                {
                    "value":"PK",
                    "label":"Pakistan"
                },
                {
                    "value":"PL",
                    "label":"Poland"
                },
                {
                    "value":"PR",
                    "label":"Puerto Rico"
                },
                {
                    "value":"PS",
                    "label":"Palestine"
                },
                {
                    "value":"PT",
                    "label":"Portugal"
                },
                {
                    "value":"PW",
                    "label":"Palau"
                },
                {
                    "value":"PY",
                    "label":"Paraguay"
                },
                {
                    "value":"QA",
                    "label":"Qatar"
                },
                {
                    "value":"RO",
                    "label":"Romania"
                },
                {
                    "value":"RS",
                    "label":"Serbia"
                },
                {
                    "value":"RU",
                    "label":"Russia"
                },
                {
                    "value":"RW",
                    "label":"Rwanda"
                },
                {
                    "value":"SA",
                    "label":"Saudi Arabia"
                },
                {
                    "value":"SB",
                    "label":"Solomon Islands"
                },
                {
                    "value":"SC",
                    "label":"Seychelles"
                },
                {
                    "value":"SD",
                    "label":"Sudan"
                },
                {
                    "value":"SE",
                    "label":"Sweden"
                },
                {
                    "value":"SG",
                    "label":"Singapore"
                },
                {
                    "value":"SI",
                    "label":"Slovenia"
                },
                {
                    "value":"SK",
                    "label":"Slovak Republic"
                },
                {
                    "value":"SL",
                    "label":"Sierra Leone"
                },
                {
                    "value":"SM",
                    "label":"San Marino"
                },
                {
                    "value":"SN",
                    "label":"Senegal"
                },
                {
                    "value":"SO",
                    "label":"Somalia"
                },
                {
                    "value":"SR",
                    "label":"Suriname"
                },
                {
                    "value":"ST",
                    "label":"Sao Tome and Principe"
                },
                {
                    "value":"SV",
                    "label":"El Salvador"
                },
                {
                    "value":"SY",
                    "label":"Syria"
                },
                {
                    "value":"SZ",
                    "label":"Swaziland"
                },
                {
                    "value":"TD",
                    "label":"Chad"
                },
                {
                    "value":"TG",
                    "label":"Togo"
                },
                {
                    "value":"TH",
                    "label":"Thailand"
                },
                {
                    "value":"TJ",
                    "label":"Tajikistan"
                },
                {
                    "value":"TM",
                    "label":"Turkmenistan"
                },
                {
                    "value":"TN",
                    "label":"Tunisia"
                },
                {
                    "value":"TO",
                    "label":"Tonga"
                },
                {
                    "value":"TR",
                    "label":"Turkey"
                },
                {
                    "value":"TT",
                    "label":"Trinidad and Tobago"
                },
                {
                    "value":"TV",
                    "label":"Tuvalu"
                },
                {
                    "value":"TW",
                    "label":"Taiwan"
                },
                {
                    "value":"TZ",
                    "label":"Tanzania"
                },
                {
                    "value":"UA",
                    "label":"Ukraine"
                },
                {
                    "value":"UG",
                    "label":"Uganda"
                },
                {
                    "value":"UY",
                    "label":"Uruguay"
                },
                {
                    "value":"UZ",
                    "label":"Uzbekistan"
                },
                {
                    "value":"VC",
                    "label":"Saint Vincent And The Grenadine"
                },
                {
                    "value":"VE",
                    "label":"Venezuela"
                },
                {
                    "value":"VG",
                    "label":"British Virgin Islands"
                },
                {
                    "value":"VN",
                    "label":"Vietnam"
                },
                {
                    "value":"VU",
                    "label":"Vanuatu"
                },
                {
                    "value":"WF",
                    "label":"Wallis and Futuna"
                },
                {
                    "value":"WS",
                    "label":"Western Samoa"
                },
                {
                    "value":"YE",
                    "label":"Yemen"
                },
                {
                    "value":"ZA",
                    "label":"South Africa"
                },
                {
                    "value":"ZM",
                    "label":"Zambia"
                },
                {
                    "value":"ZW",
                    "label":"Zimbabwe"
                }
            ],
            create_time: [],
            searchForm: {
                name: '',
                country: undefined,
            },
            tableData: [],
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let columns = [
                { title: '经销商', dataIndex: 'name' },
                { title: '国家', dataIndex: 'country' },
                { title: '手机号', dataIndex: 'phone' },
                { title: '最近登录', dataIndex: 'last_login_time', key: 'time' },
                { title: '创建时间', dataIndex: 'create_time', key: 'time' },
                // { title: '操作', dataIndex: 'handle', fixed: 'right' }, 
                { title: '操作', key: 'operation', fixed: 'right', width: 100, },
            ]
            return columns
        },
    },
    mounted() {
        this.getTableData();
    },
    methods: {
        delete(id){
            Core.Api.Dealers.delete({
                id
            }).then(res => {
                console.log("delete -> res", res)
            }).catch(err => {
                console.log('delete -> err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        routerChange(type, item = {}) {
            console.log(item)
            return
            let routeUrl = ''
            switch (type) {
                case 'edit':  // 编辑
                    routeUrl = this.$router.resolve({
                        path: "/distributor/distributor-edit",
                        query: { id: item.id }
                    })
                    break;
                case 'detail':  // 详情
                    routeUrl = this.$router.resolve({
                        path: "/distributor/distributor-detail",
                        query: { id: item.id }
                    })
                    break;
            }
            window.open(routeUrl.href, '_blank')
        },
        pageChange(curr) {  // 页码改变
            this.currPage = curr
            this.getTableData()
        },
        pageSizeChange(current, size) {  // 页码尺寸改变
            console.log('pageSizeChange size:', size)
            this.pageSize = size
            this.getTableData()
        },
        handleSearch() {  // 搜索
            this.pageChange(1);
        },
        handleSearchReset() {  // 重置搜索
            Object.assign(this.searchForm, this.$options.data().searchForm)
            console.log('this.searchForm:', this.searchForm)
            this.create_time = []
            this.pageChange(1);
        },
        handleTableChange(page, filters, sorter) {
            console.log('handleTableChange filters:', filters)
            for (const key in filters) {
                this.searchForm[key] = filters[key] ? filters[key][0] : 0
            }
        },
        getTableData() {  // 获取 表格 数据
            this.loading = true;
            this.loading = false;
            // return
            Core.Api.Dealers.list({
                ...this.searchForm,
                begin_time: this.create_time[0] || '',
                end_time: this.create_time[1] || '',
                page: this.currPage,
                page_size: this.pageSize
            }).then(res => {
                console.log("getTableData -> res", res)
                this.total = res.count;
                this.tableData = res.list;
            }).catch(err => {
                console.log('getTableData -> err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
    }
};
</script>

<style lang="less" scoped>
// #DistributorList {}
</style>