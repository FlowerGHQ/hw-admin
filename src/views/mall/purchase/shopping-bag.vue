<template>
    <div id="shopping-bag">
        <div class="content">
            <div class="title">
                <div>
                    <span>{{ $t('purchase.shopping_bag') }}（{{ $t('common.all') }}&nbsp;{{ amount || 0 }}）</span>
                    <!-- <div class="title-labels">
                        <template v-if="payType === Core.Const.MALL.payType.TT">
                            <span class="title-label">{{ $t('mall.payment_method') }}: TT</span>
                            <span class="title-label">
                                9%{{ $t('mall.advance_payment') }}, 1%{{ $t('mall.balance_payment') }}
                            </span>
                        </template>
                        <template v-if="payType === Core.Const.MALL.payType.OA">
                            <span class="title-label">{{ $t('mall.payment_method') }}: OA</span>
                            <span class="title-label">
                                9%{{ $t('mall.advance_payment') }}, 1%{{ $t('mall.balance_payment') }}，{{
                                    $t('mall.account_period')
                                }}7{{ $t('mall.days') }}
                            </span>
                        </template>
                    </div> -->
                </div>
                <span class="settlement">
                    <span class="dis">
                        {{ $t('purchase.selected_items') }}
                    </span>
                    <span class="price"> {{ currency }} {{ proxy.$Util.Number.numFormat(allPrice) }} </span>
                    <my-button
                        showRightIcon
                        type="primary"
                        padding="12px 32px"
                        :disabled="!isSelected"
                        font="14px"
                        @click.native="handleCreateOrder"
                    >
                        {{ $t('purchase.settlement') }}
                    </my-button>
                </span>
            </div>
            <a-spin tip="Loading..." :spinning="spinning">
                <table style="width: 100%">
                    <thead>
                        <tr class="select-all">
                            <th
                                :class="item.dataIndex === 'operation' ? 'operation-row' : ''"
                                :style="{ width: item.width ? `${item.width}px` : 'auto' }"
                                v-for="item in columns"
                            >
                                <template v-if="item.dataIndex === 'check'">
                                    <span class="check-box" @click="selectAll('all', !allSelected)">
                                        <svg-icon icon-class="no-select" class-name="no-select" v-if="!allSelected" />
                                        <svg-icon icon-class="selected" class-name="selected" v-else />
                                    </span>
                                </template>
                                <template v-else>
                                    <template v-if="item.dataIndex === 'product'">
                                        <span class="row-text select-all-text">
                                            {{ $t('purchase.select_all') }}
                                        </span>
                                    </template>
                                    <span class="row-text">{{ $t(item.title) }}</span>
                                </template>
                            </th>
                        </tr>
                    </thead>
                    <div class="seize"></div>
                    <!-- 整车 -->
                    <tbody v-if="getLengthNotHasGift(vehicleList) !== 0" class="list-body">
                        <tr class="row row-title">
                            <td v-for="item in columns" class="row-item">
                                <template v-if="item.dataIndex === 'check'">
                                    <span class="check-box" @click="selectAll('vehicle', !vehicleListSelected)">
                                        <svg-icon
                                            icon-class="no-select"
                                            class-name="no-select"
                                            v-if="!vehicleListSelected"
                                        />
                                        <svg-icon icon-class="selected" class-name="selected" v-else />
                                    </span>
                                </template>
                                <template v-if="item.dataIndex === 'product'">
                                    <span class="row-text">
                                        {{ $t('mall.vehicle_models') }}({{ getLengthNotHasGift(vehicleList) }})
                                    </span>
                                </template>
                            </td>
                        </tr>
                        <tr v-for="(item, index) in vehicleList" class="row" :class="[!item.isGift ? '' : 'gift']">
                            <td
                                v-for="columnsItem in columns"
                                class="row-item"
                                :class="
                                    (!item.flag_item_valid ? 'invalid' : '',
                                    columnsItem.dataIndex === 'check' ? 'row-item-check' : '')
                                "
                            >
                                <template v-if="columnsItem.dataIndex === 'check' && !item.isGift">
                                    <span class="check-box" @click="changeSelect(item, 'vehicleList')">
                                        <svg-icon icon-class="no-select" class-name="no-select" v-if="!item.selected" />
                                        <svg-icon icon-class="selected" class-name="selected" v-else />
                                    </span>
                                    <span class="invalid-box">
                                        {{ $t('common.invalid') }}
                                    </span>
                                </template>
                                <template v-if="columnsItem.dataIndex === 'product'">
                                    <div class="product">
                                        <div class="product-img">
                                            <a-image :src="$Util.imageFilter(item?.item?.logo, 5)" />
                                        </div>
                                        <div class="product-mes">
                                            <p class="name">
                                                <span
                                                    class="name-text"
                                                    :title="item?.item[$Util.regionalUnitMoney().name_index]"
                                                >
                                                    {{ item?.item[$Util.regionalUnitMoney().name_index] }}
                                                </span>
                                                <span class="label" v-if="item.isGift">
                                                    {{ $t('purchase.free_gift') }}
                                                </span>
                                            </p>
                                            <p class="code">{{ item?.item?.code ? item?.item?.code : '-' }}</p>
                                            <p
                                                class="version"
                                                @click="showDrawer(item)"
                                                v-if="item?.item.set_id && !item.isGift"
                                            >
                                                <span>
                                                    {{ $Util.itemSpecFilter(item.item.attr_list, lang) }}
                                                </span>
                                                <svg-icon icon-class="cart-arrow-right" class-name="cart-arrow-right" />
                                                <svg-icon
                                                    icon-class="cart-arrow-right-active"
                                                    class-name="cart-arrow-right-active"
                                                />
                                            </p>
                                        </div>
                                    </div>
                                </template>
                                <template v-if="columnsItem.dataIndex === 'price'">
                                    <span class="row-text unit-price"
                                        >{{ currency
                                        }}{{
                                            $Util.Number.numFormat(
                                                $Util.countFilter(
                                                    item?.item[$Util.Number.getStepPriceIndexByNums(item.amount)],
                                                ),
                                            )
                                        }}</span
                                    >
                                </template>
                                <template v-if="columnsItem.dataIndex === 'quantity'">
                                    <div class="count-edit">
                                        <template v-if="!item.isGift">
                                            <a-input-number
                                                v-model:value="item.amount"
                                                :min="1"
                                                :max="99999"
                                                :precision="0"
                                                @blur="changeAmount(item)"
                                            />
                                        </template>
                                        <template v-else>
                                            <span class="count-number"> ×{{ item.amount }} </span>
                                        </template>
                                    </div>
                                </template>
                                <template v-if="columnsItem.dataIndex === 'operation'">
                                    <div class="operation">
                                        <span class="row-text price">
                                            <template v-if="!item.isGift">
                                                {{ currency
                                                }}{{
                                                    $Util.Number.numFormat(
                                                        $Util.countFilter(
                                                            item.amount *
                                                                item?.item[
                                                                    $Util.Number.getStepPriceIndexByNums(item.amount)
                                                                ],
                                                        ),
                                                    )
                                                }}
                                            </template>
                                            <template v-else>
                                                {{ currency }}0<span class="original-price">12123</span>
                                            </template>
                                        </span>
                                        <template v-if="!item.isGift">
                                            <span class="row-text delete" @click="handleShopCartRemove(item)">{{
                                                $t('common.delete')
                                            }}</span>
                                        </template>
                                        <template v-else>
                                            <span class="row-text excluding">{{ $t('mall.excluding') }}</span>
                                        </template>
                                    </div>
                                </template>
                            </td>
                        </tr>
                    </tbody>
                    <div class="seize"></div>
                    <!-- 零配件 -->
                    <tbody v-if="accessoriesList.length !== 0" class="list-body">
                        <tr class="row row-title">
                            <td v-for="item in columns" class="row-item">
                                <template v-if="item.dataIndex === 'check'">
                                    <span class="check-box" @click="selectAll('accessories', !accessoriesListSelected)">
                                        <svg-icon
                                            icon-class="no-select"
                                            class-name="no-select"
                                            v-if="!accessoriesListSelected"
                                        />
                                        <svg-icon icon-class="selected" class-name="selected" v-else />
                                    </span>
                                </template>
                                <template v-if="item.dataIndex === 'product'">
                                    <span class="row-text">
                                        {{ $t('mall.accessories') }}({{ accessoriesList.length }})
                                    </span>
                                </template>
                            </td>
                        </tr>
                        <tr v-for="item in accessoriesList" class="row">
                            <td
                                v-for="columnsItem in columns"
                                class="row-item"
                                :class="
                                    (!item.flag_item_valid ? 'invalid' : '',
                                    columnsItem.dataIndex === 'check' ? 'row-item-check' : '')
                                "
                            >
                                <template v-if="columnsItem.dataIndex === 'check'">
                                    <span class="check-box" @click="changeSelect(item, 'accessoriesList')">
                                        <svg-icon icon-class="no-select" class-name="no-select" v-if="!item.selected" />
                                        <svg-icon icon-class="selected" class-name="selected" v-else />
                                    </span>
                                    <span class="invalid-box">
                                        {{ $t('common.invalid') }}
                                    </span>
                                </template>
                                <template v-if="columnsItem.dataIndex === 'product'">
                                    <div class="product">
                                        <div class="product-img">
                                            <a-image :src="$Util.imageFilter(item?.item?.logo, 5)" />
                                        </div>
                                        <div class="product-mes">
                                            <p class="name">
                                                <span
                                                    class="name-text"
                                                    :title="item?.item[$Util.regionalUnitMoney().name_index]"
                                                >
                                                    {{ item?.item[$Util.regionalUnitMoney().name_index] }}
                                                </span>
                                            </p>
                                            <p class="code">{{ item?.item?.code ? item?.item?.code : '-' }}</p>
                                            <p class="version" @click="showDrawer(item)" v-if="item?.item.set_id">
                                                <span>
                                                    {{ $Util.itemSpecFilter(item.item.attr_list, lang) }}
                                                </span>
                                                <svg-icon icon-class="cart-arrow-right" class-name="cart-arrow-right" />
                                                <svg-icon
                                                    icon-class="cart-arrow-right-active"
                                                    class-name="cart-arrow-right-active"
                                                />
                                            </p>
                                        </div>
                                    </div>
                                </template>
                                <template v-if="columnsItem.dataIndex === 'price'">
                                    <span class="row-text unit-price"
                                        >{{ currency
                                        }}{{
                                            $Util.Number.numFormat(
                                                $Util.countFilter(
                                                    item?.item[$Util.Number.getStepPriceIndexByNums(item.amount)],
                                                ),
                                            )
                                        }}</span
                                    >
                                </template>
                                <template v-if="columnsItem.dataIndex === 'quantity'">
                                    <div class="count-edit">
                                        <a-input-number
                                            v-model:value="item.amount"
                                            :min="1"
                                            :max="99999"
                                            :precision="0"
                                            @blur="changeAmount(item)"
                                        />
                                    </div>
                                </template>
                                <template v-if="columnsItem.dataIndex === 'operation'">
                                    <div class="operation">
                                        <span class="row-text price"
                                            >{{ currency
                                            }}{{
                                                $Util.Number.numFormat(
                                                    $Util.countFilter(
                                                        item.amount *
                                                            item?.item[
                                                                $Util.Number.getStepPriceIndexByNums(item.amount)
                                                            ],
                                                    ),
                                                )
                                            }}</span
                                        >
                                        <span class="row-text delete" @click="handleShopCartRemove(item)">{{
                                            $t('common.delete')
                                        }}</span>
                                    </div>
                                </template>
                            </td>
                        </tr>
                    </tbody>
                    <div class="seize"></div>
                    <!-- 周边件 -->
                    <tbody v-if="peripheralList.length !== 0" class="list-body">
                        <tr class="row row-title">
                            <td v-for="item in columns" class="row-item">
                                <template v-if="item.dataIndex === 'check'">
                                    <span
                                        class="check-box"
                                        @click="selectAll('peripheral_products', !peripheralListSelected)"
                                    >
                                        <svg-icon
                                            icon-class="no-select"
                                            class-name="no-select"
                                            v-if="!peripheralListSelected"
                                        />
                                        <svg-icon icon-class="selected" class-name="selected" v-else />
                                    </span>
                                </template>
                                <template v-if="item.dataIndex === 'product'">
                                    <span class="row-text">
                                        {{ $t('mall.peripheral_products') }}({{ peripheralList.length }})
                                    </span>
                                </template>
                            </td>
                        </tr>
                        <tr v-for="item in peripheralList" class="row">
                            <td
                                v-for="columnsItem in columns"
                                class="row-item"
                                :class="
                                    (!item.flag_item_valid ? 'invalid' : '',
                                    columnsItem.dataIndex === 'check' ? 'row-item-check' : '')
                                "
                            >
                                <template v-if="columnsItem.dataIndex === 'check'">
                                    <span class="check-box" @click="changeSelect(item, 'peripheralList')">
                                        <svg-icon icon-class="no-select" class-name="no-select" v-if="!item.selected" />
                                        <svg-icon icon-class="selected" class-name="selected" v-else />
                                    </span>
                                    <span class="invalid-box">
                                        {{ $t('common.invalid') }}
                                    </span>
                                </template>
                                <template v-if="columnsItem.dataIndex === 'product'">
                                    <div class="product">
                                        <div class="product-img">
                                            <a-image :src="$Util.imageFilter(item?.item?.logo, 5)" />
                                        </div>
                                        <div class="product-mes">
                                            <p class="name">
                                                <span
                                                    class="name-text"
                                                    :title="item?.item[$Util.regionalUnitMoney().name_index]"
                                                >
                                                    {{ item?.item[$Util.regionalUnitMoney().name_index] }}
                                                </span>
                                            </p>
                                            <p class="code">{{ item?.item?.code ? item?.item?.code : '-' }}</p>
                                            <p class="version" @click="showDrawer(item)" v-if="item?.item.set_id">
                                                <span>
                                                    {{ $Util.itemSpecFilter(item.item.attr_list, lang) }}
                                                </span>
                                                <svg-icon icon-class="cart-arrow-right" class-name="cart-arrow-right" />
                                                <svg-icon
                                                    icon-class="cart-arrow-right-active"
                                                    class-name="cart-arrow-right-active"
                                                />
                                            </p>
                                        </div>
                                    </div>
                                </template>
                                <template v-if="columnsItem.dataIndex === 'price'">
                                    <span class="row-text unit-price"
                                        >{{ currency
                                        }}{{
                                            $Util.Number.numFormat(
                                                $Util.countFilter(
                                                    item?.item[$Util.Number.getStepPriceIndexByNums(item.amount)],
                                                ),
                                            )
                                        }}</span
                                    >
                                </template>
                                <template v-if="columnsItem.dataIndex === 'quantity'">
                                    <div class="count-edit">
                                        <a-input-number
                                            v-model:value="item.amount"
                                            :min="1"
                                            :max="99999"
                                            :precision="0"
                                            @blur="changeAmount(item)"
                                        />
                                    </div>
                                </template>
                                <template v-if="columnsItem.dataIndex === 'operation'">
                                    <div class="operation">
                                        <span class="row-text price"
                                            >{{ currency
                                            }}{{
                                                $Util.Number.numFormat(
                                                    $Util.countFilter(
                                                        item.amount *
                                                            item?.item[
                                                                $Util.Number.getStepPriceIndexByNums(item.amount)
                                                            ],
                                                    ),
                                                )
                                            }}</span
                                        >
                                        <span class="row-text delete" @click="handleShopCartRemove(item)">{{
                                            $t('common.delete')
                                        }}</span>
                                    </div>
                                </template>
                            </td>
                        </tr>
                    </tbody>
                    <div class="seize"></div>
                    <!-- 广宣品 -->
                    <tbody v-if="promotionalList.length !== 0" class="list-body">
                        <tr class="row row-title">
                            <td v-for="item in columns" class="row-item">
                                <template v-if="item.dataIndex === 'check'">
                                    <span
                                        class="check-box"
                                        @click="selectAll('promotional_products', !promotionalListSelected)"
                                    >
                                        <svg-icon
                                            icon-class="no-select"
                                            class-name="no-select"
                                            v-if="!promotionalListSelected"
                                        />
                                        <svg-icon icon-class="selected" class-name="selected" v-else />
                                    </span>
                                </template>
                                <template v-if="item.dataIndex === 'product'">
                                    <span class="row-text">
                                        {{ $t('mall.promotional_products') }}({{ promotionalList.length }})
                                    </span>
                                </template>
                            </td>
                        </tr>
                        <tr v-for="item in promotionalList" class="row">
                            <td
                                v-for="columnsItem in columns"
                                class="row-item"
                                :class="
                                    (!item.flag_item_valid ? 'invalid' : '',
                                    columnsItem.dataIndex === 'check' ? 'row-item-check' : '')
                                "
                            >
                                <template v-if="columnsItem.dataIndex === 'check'">
                                    <span class="check-box" @click="changeSelect(item, 'promotionalList')">
                                        <svg-icon icon-class="no-select" class-name="no-select" v-if="!item.selected" />
                                        <svg-icon icon-class="selected" class-name="selected" v-else />
                                    </span>
                                    <span class="invalid-box">
                                        {{ $t('common.invalid') }}
                                    </span>
                                </template>
                                <template v-if="columnsItem.dataIndex === 'product'">
                                    <div class="product">
                                        <div class="product-img">
                                            <a-image :src="$Util.imageFilter(item?.item?.logo, 5)" />
                                        </div>
                                        <div class="product-mes">
                                            <p class="name">
                                                <span
                                                    class="name-text"
                                                    :title="item?.item[$Util.regionalUnitMoney().name_index]"
                                                >
                                                    {{ item?.item[$Util.regionalUnitMoney().name_index] }}
                                                </span>
                                            </p>
                                            <p class="code">{{ item?.item?.code ? item?.item?.code : '-' }}</p>
                                            <p class="version" @click="showDrawer(item)" v-if="item?.item.set_id">
                                                <span>
                                                    {{ $Util.itemSpecFilter(item.item.attr_list, lang) }}
                                                </span>
                                                <svg-icon icon-class="cart-arrow-right" class-name="cart-arrow-right" />
                                                <svg-icon
                                                    icon-class="cart-arrow-right-active"
                                                    class-name="cart-arrow-right-active"
                                                />
                                            </p>
                                        </div>
                                    </div>
                                </template>
                                <template v-if="columnsItem.dataIndex === 'price'">
                                    <span class="row-text unit-price"
                                        >{{ currency
                                        }}{{
                                            $Util.Number.numFormat(
                                                $Util.countFilter(
                                                    item?.item[$Util.Number.getStepPriceIndexByNums(item.amount)],
                                                ),
                                            )
                                        }}</span
                                    >
                                </template>
                                <template v-if="columnsItem.dataIndex === 'quantity'">
                                    <div class="count-edit">
                                        <a-input-number
                                            v-model:value="item.amount"
                                            :min="1"
                                            :max="99999"
                                            :precision="0"
                                            @blur="changeAmount(item)"
                                        />
                                    </div>
                                </template>
                                <template v-if="columnsItem.dataIndex === 'operation'">
                                    <div class="operation">
                                        <span class="row-text price"
                                            >{{ currency
                                            }}{{
                                                $Util.Number.numFormat(
                                                    $Util.countFilter(
                                                        item.amount *
                                                            item?.item[
                                                                $Util.Number.getStepPriceIndexByNums(item.amount)
                                                            ],
                                                    ),
                                                )
                                            }}</span
                                        >
                                        <span class="row-text delete" @click="handleShopCartRemove(item)">{{
                                            $t('common.delete')
                                        }}</span>
                                    </div>
                                </template>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </a-spin>
        </div>
        <!-- 底部支付栏 -->
        <div class="settlement-fixed">
            <div class="settlement-fixed-body">
                <div class="check">
                    <span class="check-box" @click="selectAll('all', !allSelected)">
                        <svg-icon icon-class="no-select" class-name="no-select" v-if="!allSelected" />
                        <svg-icon icon-class="selected" class-name="selected" v-else />
                    </span>
                    <span class="check-text">
                        {{ $t('purchase.select_all') }}
                    </span>
                </div>
                <div class="settlement">
                    <div class="settlement-mes">
                        <div class="settlement-price">
                            <span class="select-nums">
                                <span class="nums">
                                    {{ selectNums }}
                                </span>
                                {{ $t('purchase.s_items') }}
                            </span>
                            <span class="dis">
                                {{ $t('purchase.selected_items_total') }}
                            </span>
                            <span class="price"> {{ currency }} {{ proxy.$Util.Number.numFormat(allPrice) }} </span>
                        </div>
                        <template v-if="org?.pay_type === 70">
                            <!-- 授信余额足 -->
                            <template v-if="isBalanceEnough">
                                <p class="settlement-balance">
                                    {{ $t('mall.credit_balance') }}: {{ currency }} {{ balance }}
                                </p>
                            </template>
                            <!-- 授信余额不足 -->
                            <template>
                                <p class="settlement-balance warn">
                                    {{ $t('mall.credit_balance') }}: {{ currency }} {{ balance }} ({{
                                        $t('mall.insufficient_balance')
                                    }}
                                    {{
                                        proxy.$Util.Number.numFormat(
                                            parseFloat(
                                                (
                                                    allPrice.value - Math.ceil(allPrice.value * org.pay_pre_pay_ratio)
                                                ).toFixed(4),
                                            ),
                                        )
                                    }})
                                </p>
                            </template>
                        </template>
                    </div>
                    <my-button
                        showRightIcon
                        type="primary"
                        padding="12px 32px"
                        :disabled="!isSelected"
                        font="14px"
                        @click.native="handleCreateOrder"
                    >
                        {{ $t('purchase.settlement') }}
                    </my-button>
                </div>
            </div>
        </div>
        <!-- 更改版本弹窗 -->
        <a-drawer
            title=""
            class="version-drawer"
            height="80%"
            :closable="false"
            destroyOnClose
            maskClosable
            :footer="null"
            placement="bottom"
            :visible="visible"
            @close="onClose"
        >
            <div class="drawer">
                <div class="vehicle-body-series">
                    <div class="series-cards" :class="specList?.length > 3 ? 'padding-bottom' : ''">
                        <div
                            class="series-card"
                            :style="{ flex: specList?.length > 2 ? 'none' : '1' }"
                            v-for="(item, i) in specList"
                            :key="item.id"
                            @click="selectSeries(i)"
                        >
                            <seriesCard :record="item" :selected="seriesIndex === i" />
                        </div>
                    </div>
                    <div class="variants">
                        <p class="nums">{{ itemList?.length || 0 }} Variants</p>
                        <div class="variants-body">
                            <div
                                class="variants-item"
                                @click="selectVariants(i)"
                                v-for="(item, i) in itemList"
                                :key="item.id"
                            >
                                <ProductsCard
                                    :showOperation="false"
                                    type="small"
                                    :record="item"
                                    :selected="variantsIndex === i"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <a-empty :description="null" v-if="specList?.length === 0 && itemList?.length === 0" />
            </div>
            <div class="drawer-footer">
                <div class="drawer-footer-body">
                    <my-button padding="12px 32px" font="14px" @click.native="onClose">
                        {{ $t('common.cancel') }}
                    </my-button>
                    <my-button type="primary" padding="12px 32px" font="14px" @click.native="changeItem">
                        {{ $t('common.confirm') }}
                    </my-button>
                </div>
            </div>
        </a-drawer>
        <MallModal
            :title="$t('mall.order_reminder')"
            :visible="reminderVisible"
            @handleClose="handleClose"
            @handleConfirm="handleConfirm"
        >
            {{ $t('mall.order_reminder_content') }}
        </MallModal>
    </div>
</template>

<script setup>
import MyButton from '@/components/common/MyButton.vue';
import SvgIcon from '@/components/MySvgIcon/index.vue';
import seriesCard from './vehicle/components/series-card.vue';
import ProductsCard from '../components/ProductsCard.vue';
import Core from '@/core';
import axios from 'axios';
import { ref, reactive, onMounted, computed, watch, getCurrentInstance, nextTick, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import MallModal from '../components/MallModal.vue';
const { proxy } = getCurrentInstance();
const route = useRoute();
const router = useRouter();
const store = useStore();

const columns = [
    {
        title: 'purchase.select_all',
        dataIndex: 'check',
        key: 'check',
        width: 20,
    },
    {
        title: 'purchase.product_information',
        dataIndex: 'product',
        key: 'product',
    },
    {
        title: 'purchase.unit_price',
        dataIndex: 'price',
        key: 'price',
        width: 200,
    },
    {
        title: 'purchase.quantity',
        dataIndex: 'quantity',
        key: 'quantity',
        width: 250,
    },
    {
        title: 'purchase.total_operation',
        dataIndex: 'operation',
        key: 'operation',
        width: 200,
    },
];
/* state start */
const orgId = Core.Data.getOrgId();
const orgType = Core.Data.getOrgType();
const org = Core.Data.getOrgObj();
const balance = ref(0);
const reminderVisible = ref(false);
const payType = ref(2);
const currency = ref('€');
const paramPrice = ref(false);
const visible = ref(false);
const spinning = ref(false);
const payLoading = ref(false);
const specList = ref([]);
const itemList = ref([]);
const vehicleList = ref([]);
const accessoriesList = ref([]);
const peripheralList = ref([]);
const promotionalList = ref([]);
const selectedId = ref({
    vehicleList: [],
    accessoriesList: [],
    peripheralList: [],
    promotionalList: [],
});
const editCount = ref('');
const set_id = ref('');
const item_id = ref('');
const seriesIndex = ref(0);
const variantsIndex = ref(0);
const unitMap = reactive({
    '€': { key: '_eur', text: '€ (EUR)' },
    $: { key: '_usd', text: '$ (USD)' },
});
const shopCartListFetch = Core.Api.ShopCart.list;
const listBySetFetch = Core.Api.AttrDef.listBySet;
const itemListFetch = Core.Api.Item.list;
const switchItemFetch = Core.Api.ShopCart.switchItem;
/* state end */

/* computed start */
const lang = computed(() => {
    return store.state.lang;
});
const amount = computed(() => {
    return (
        getLengthNotHasGift(vehicleList.value) +
        accessoriesList.value.length +
        peripheralList.value.length +
        promotionalList.value.length
    );
});
const isBalanceEnough = computed(() => {
    const sum = parseFloat((allPrice.value - Math.ceil(allPrice.value * org.pay_pre_pay_ratio)).toFixed(4)); // 总尾款
    return sum <= balance.value;
});
// 计算是否全选车辆
const vehicleListSelected = computed(() => {
    const vehicleListLen = vehicleList.value.filter(item => item.flag_item_valid && !item.isGift).length;
    return selectedId.value['vehicleList'].length === vehicleListLen && vehicleListLen;
});
// 计算是否全选配件
const accessoriesListSelected = computed(() => {
    const accessoriesListLen = accessoriesList.value.filter(item => item.flag_item_valid).length;
    return selectedId.value['accessoriesList'].length === accessoriesListLen && accessoriesListLen;
});
// 计算是否全选周边
const peripheralListSelected = computed(() => {
    const peripheralListLen = peripheralList.value.filter(item => item.flag_item_valid).length;
    return selectedId.value['peripheralList'].length === peripheralListLen && peripheralListLen;
});
// 计算是否全选广宣品
const promotionalListSelected = computed(() => {
    const promotionalListLen = promotionalList.value.filter(item => item.flag_item_valid).length;
    return selectedId.value['promotionalList'].length === promotionalList.value.length && promotionalListLen;
});
// 计算是否全部选中
const allSelected = computed(() => {
    const vehicleListLen = vehicleList.value.filter(item => item.flag_item_valid && !item.isGift).length;
    const accessoriesListLen = accessoriesList.value.filter(item => item.flag_item_valid).length;
    const peripheralListLen = peripheralList.value.filter(item => item.flag_item_valid).length;
    const promotionalListLen = promotionalList.value.filter(item => item.flag_item_valid).length;
    const lens = vehicleListLen + accessoriesListLen + peripheralListLen + promotionalListLen;
    return (
        selectedId.value['vehicleList'].length === vehicleListLen &&
        selectedId.value['accessoriesList'].length === accessoriesListLen &&
        selectedId.value['peripheralList'].length === peripheralListLen &&
        selectedId.value['promotionalList'].length === promotionalListLen &&
        lens
    );
});
// 计算是否有被选中产品
const isSelected = computed(() => {
    return (
        selectedId.value['vehicleList'].length !== 0 ||
        selectedId.value['accessoriesList'].length !== 0 ||
        selectedId.value['peripheralList'].length !== 0 ||
        selectedId.value['promotionalList'].length !== 0
    );
});
// 计算选中产品数量
const selectNums = computed(() => {
    let nums = 0;
    nums += selectedId.value['vehicleList'].length;
    nums += selectedId.value['accessoriesList'].length;
    nums += selectedId.value['peripheralList'].length;
    nums += selectedId.value['promotionalList'].length;
    return nums;
});
// 计算选中产品总价
const allPrice = computed(() => {
    let price = 0;
    vehicleList.value.find(item => {
        if (item.selected) {
            price += item.amount * item?.item[proxy.$Util.Number.getStepPriceIndexByNums(item.amount)];
        }
    });
    accessoriesList.value.find(item => {
        if (item.selected) {
            price += item.amount * item?.item[proxy.$Util.Number.getStepPriceIndexByNums(item.amount)];
        }
    });
    peripheralList.value.find(item => {
        if (item.selected) {
            price += item.amount * item?.item[proxy.$Util.Number.getStepPriceIndexByNums(item.amount)];
        }
    });
    promotionalList.value.find(item => {
        if (item.selected) {
            price += item.amount * item?.item[proxy.$Util.Number.getStepPriceIndexByNums(item.amount)];
        }
    });
    return proxy.$Util.countFilter(price.toFixed(2));
});
/* computed end */

/* watch start */
/* watch end */

onMounted(() => {
    if (Core.Data.getCurrency() === 'EUR') {
        currency.value = '€';
    } else {
        currency.value = '$';
    }
    getData();
    getWallet();
});

/* methods start */
// 获取数据
const getData = () => {
    getVehicleList();
};
// 处理接口数据
const filterData = (list, type) => {
    if (!list || list.length === 0) return;
    list = list.map(item => {
        const index = selectedId.value[type].indexOf(item.id);
        item.selected = index === -1 ? false : true;
        if (item.item.set_id) {
            item.item.logo = item.item.imgs;
        }
        return item;
    });
};
// 修改数量
const changeAmount = item => {
    handleAddCart(item);
};
// 选中按钮
const changeSelect = (item, type) => {
    if (item.selected) {
        item.selected = !item.selected;
        const index = selectedId.value[type].indexOf(item.id);
        selectedId.value[type].splice(index, 1);
    } else {
        item.selected = !item.selected;
        selectedId.value[type].push(item.id);
    }
};
// 全选按钮
const selectAll = (type, selected = false) => {
    switch (type) {
        case 'vehicle':
            selectedId.value['vehicleList'] = [];
            if (selected) {
                vehicleList.value = vehicleList.value.map(item => {
                    if (item.flag_item_valid && !item.isGift) {
                        item.selected = selected;
                        selectedId.value['vehicleList'].push(item.id);
                    }
                    return item;
                });
            } else {
                vehicleList.value = vehicleList.value.map(item => {
                    item.selected = selected;
                    return item;
                });
            }
            break;
        case 'accessories':
            selectedId.value['accessoriesList'] = [];
            if (selected) {
                accessoriesList.value = accessoriesList.value.map(item => {
                    if (item.flag_item_valid) {
                        item.selected = selected;
                        selectedId.value['accessoriesList'].push(item.id);
                    }
                    return item;
                });
            } else {
                accessoriesList.value = accessoriesList.value.map(item => {
                    item.selected = selected;
                    return item;
                });
            }
            break;
        case 'peripheral_products':
            selectedId.value['peripheralList'] = [];
            if (selected) {
                peripheralList.value = peripheralList.value.map(item => {
                    if (item.flag_item_valid) {
                        item.selected = selected;
                        selectedId.value['peripheralList'].push(item.id);
                    }
                    return item;
                });
            } else {
                peripheralList.value = peripheralList.value.map(item => {
                    item.selected = selected;
                    return item;
                });
            }
            break;
        case 'promotional_products':
            selectedId.value['promotionalList'] = [];
            if (selected) {
                promotionalList.value = promotionalList.value.map(item => {
                    if (item.flag_item_valid) {
                        item.selected = selected;
                        selectedId.value['promotionalList'].push(item.id);
                    }
                    return item;
                });
            } else {
                promotionalList.value = promotionalList.value.map(item => {
                    item.selected = selected;
                    return item;
                });
            }
            break;
        case 'all':
            selectAll('vehicle', selected);
            selectAll('accessories', selected);
            selectAll('peripheral_products', selected);
            selectAll('promotional_products', selected);
            break;

        default:
            break;
    }
};
// 打开修改版本弹窗
const showDrawer = item => {
    item_id.value = item?.id;
    set_id.value = item?.item?.set_id;
    getListBySet({ set_id: set_id.value });
    visible.value = true;
};
// 关闭修改版本弹窗
const onClose = () => {
    seriesIndex.value = 0;
    variantsIndex.value = 0;
    set_id.value = '';
    item_id.value = '';
    visible.value = false;
};
// 获取系列列表
const getSpecList = list => {
    specList.value = [];
    list.forEach((item, i) => {
        const valueList = item.value.split(',');
        const valueEnList = item.value_en.split(',');
        const descList = item.desc.split(',');
        const descEnList = item.desc_en.split(',');
        valueList.forEach((value, valueIndex) => {
            const price = item.range_of_fob_price_list.find(price => price.value === value);
            const obj = Object.assign(item, {
                desc: descList[valueIndex],
                desc_en: descEnList[valueIndex],
                value: value,
                value_en: valueEnList[valueIndex],
                ...price,
            });
            specList.value.push(Core.Util.deepCopy(obj));
        });
    });
};
// 选择系列
const selectSeries = i => {
    seriesIndex.value = i;
    const q = {
        set_id: set_id.value, //商品组id
        attr_def_id: specList.value[i]?.id, //通用规格id
        attr_def_value: specList.value[i]?.value, //通用规格值
    };
    getCarList(q);
};
// 选择 variants
const selectVariants = i => {
    variantsIndex.value = i;
};
// 回到顶部
const back2Top = () => {
    setTimeout(() => {
        window.scrollTo(0, 0);
    }, 0);
};
const getVehicleListHasGift = list => {
    list[0].giftList = [{ ...list[0], isGift: true }];
    return list.forEach((item, index) => {
        if (item?.giftList && item?.giftList.length > 0) {
            item.giftList.forEach(iGift => {
                iGift.isGift = true;
            });
            list.splice(index + 1, 0, ...item.giftList);
            item.giftList = null;
        }
        return item;
    });
};
const getLengthNotHasGift = list => {
    return list.filter(i => !i.isGift).length;
};
/* methods end */

/* fetch start */
const getVehicleList = () => {
    spinning.value = true;
    const params = {
        page: 1,
        page_size: 999,
        item_type: 1, //商品分类：1.整车；2.零部件；3.周边；4.广宣品
    };
    axios
        .all([
            shopCartListFetch({ ...params, item_type: 1 }),
            shopCartListFetch({ ...params, item_type: 2 }),
            shopCartListFetch({ ...params, item_type: 3 }),
            shopCartListFetch({ ...params, item_type: 4 }),
        ])
        .then(res => {
            vehicleList.value = res[0]?.list;
            accessoriesList.value = res[1]?.list;
            peripheralList.value = res[2]?.list;
            promotionalList.value = res[3]?.list;
            // getVehicleListHasGift(vehicleList.value);// 获取赠品
            filterData(vehicleList.value, 'vehicleList');
            filterData(accessoriesList.value, 'accessoriesList');
            filterData(peripheralList.value, 'peripheralList');
            filterData(promotionalList.value, 'promotionalList');
            back2Top();
        })
        .finally(() => {
            spinning.value = false;
        });
};
// 从购物车移出
const handleShopCartRemove = item => {
    proxy.$confirm({
        title: proxy.$t('pop_up.item'),
        okText: proxy.$t('def.sure'),
        okType: 'danger',
        cancelText: proxy.$t('def.cancel'),
        onOk() {
            Core.Api.ShopCart.remove({ id: item.id }).then(() => {
                proxy.$message.success(proxy.$t('pop_up.move'));
                getVehicleList(); // 更新
            });
        },
    });
};
// 添加购物车
const handleAddCart = item => {
    const params = {
        item_id: item.item_id, //商品id
        amount: item.amount, //数量
    };
    Core.Api.ShopCart.save({ ...params })
        .then(() => {
            getVehicleList(); // 更新
        })
        .finally(() => {
            editCount.value = '';
        });
};
// 获取 同规格商品 列表接口
const getListBySet = (params = {}) => {
    listBySetFetch({
        set_id: params.set_id, //商品组id
        flag_category: 1, //是否为分类（0.否，1.是）
        ...params,
    })
        .then(res => {
            getSpecList(res.list);
            const q = {
                set_id: params.set_id, //商品组id
                attr_def_id: specList.value[0]?.id, //通用规格id
                attr_def_value: specList.value[0]?.value, //通用规格值
            };
            getCarList(q);
        })
        .catch(err => {
            console.log('getSpecList err', err);
        });
};
const getCarList = q => {
    const params = {
        type: 1, //1.整车；2.零部件/物料；3.周边；4.广宣品
        page: 1,
        page_size: 999,
    };
    Object.assign(params, q);
    itemListFetch({ ...params }).then(res => {
        itemList.value = res?.list.map(item => {
            item.logo = item.imgs;
            return item;
        });
    });
};
// 切换商品
const changeItem = () => {
    const item = itemList.value[variantsIndex.value];
    const params = {
        id: item_id.value,
        item_id: item?.id, //商品id
    };
    switchItemFetch({ ...params }).then(res => {
        proxy.$message.success(proxy.$t('pop_up.modify'));
        getVehicleList();
        onClose();
    });
};
// 创建订单
const handleCreateOrder = () => {
    if (org?.pay_type === 70 && !isBalanceEnough.value) {
        reminderVisible.value = true;
        return;
    }
    const arr = [];
    for (let i in selectedId.value) {
        selectedId.value[i].forEach(item => {
            arr.push(item);
        });
    }
    Core.Data.setCartData(arr);
    let routeUrl = router.resolve({
        path: '/mall/confirm-order',
        query: {
            unit: currency.value,
            currency: unitMap[currency.value].key,
        },
    });
    window.open(routeUrl.href, '_self');
};
const handleClose = () => {
    reminderVisible.value = false;
};
const handleConfirm = () => {
    reminderVisible.value = false;
};
const getWallet = () => {
    const params = {
        org_id: orgId, //组织id
        org_type: orgType, //组织类型
        type: 40, //钱包类型：10.售前余额；20.售后余额；30.售后备件账户；40.授信账户
        currency_type: Core.Const.WALLET.TYPE[org.currency], //货币类型：1.人民币；2.欧元；3.美元；4.英镑
    };
    Core.Api.Purchase.getWallet(params)
        .then(res => {
            balance.value = Core.Util.countFilter(res.balance || 0 + Number(org.credit));
        })
        .catch(err => {
            console.log('handleCreateOrder err', err);
        });
};
/* fetch end */
</script>

<style lang="scss" scoped src="../css/layout.css"></style>
<style lang="less" scoped>
#shopping-bag {
    .content {
        padding-top: 48px;
    }

    .settlement-fixed {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        background: #fff;
        border-top: 1px solid #e5e6eb;
        z-index: 999;

        .settlement-fixed-body {
            min-height: 80px;
            width: 75%;
            margin: 0 auto;
            padding: 12px 0;
            padding-left: 24px;
            .flex(space-between, center, row);

            .check {
                .flex(initial, center, row);

                .check-text {
                    color: #000;
                    font-size: 14px;
                    font-style: normal;
                    font-weight: 500;
                    line-height: 150%;
                    margin-left: 12px;
                }
            }

            .settlement {
                .flex(initial, center, row);
                .settlement-mes {
                    margin-right: 24px;
                    .settlement-price {
                        .flex(initial, center, row);
                    }
                }
                .settlement-balance {
                    line-height: 21px;
                    color: #666666;
                    text-align: right;
                    &.warn {
                        color: #ff3636;
                    }
                }
                .select-nums {
                    color: #000;
                    font-size: 14px;
                    font-style: normal;
                    font-weight: 500;
                    line-height: 24px;
                    margin-right: 24px;

                    .nums {
                        background: linear-gradient(100deg, #c6f 0%, #66f 100%);
                        background-clip: text;
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                    }
                }

                .dis {
                    color: #000;
                    font-size: 14px;
                    font-style: normal;
                    font-weight: 500;
                    line-height: 24px;
                    margin-right: 8px;
                }

                .price {
                    color: #8f00ff;
                    font-size: 24px;
                    font-style: normal;
                    font-weight: 700;
                    line-height: 29px;
                }
            }
        }
    }

    .title {
        color: #000;
        font-size: 32px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
        margin-bottom: 24px;
        .flex(space-between, flex-end, row);

        .settlement {
            .flex(initial, center, row);

            .dis {
                color: #000;
                font-size: 12px;
                font-style: normal;
                font-weight: 400;
                line-height: 24px;
                margin-right: 10px;
            }

            .price {
                color: #8f00ff;
                text-align: right;
                font-size: 24px;
                font-style: normal;
                font-weight: 700;
                line-height: normal;
                margin-right: 24px;
            }
        }
        .title-labels {
            .fcc();
            margin-top: 10px;
        }
        .title-label {
            display: inline-block;
            padding: 7px 8px;
            border: 1px solid;
            background: transparent;
            background: linear-gradient(100deg, #c6f 0%, #66f 100%);
            border-image: linear-gradient(100deg, #c6f 0%, #66f 100%) 1;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            font-size: 12px;
            font-weight: 500;
            line-height: 12px;
            &:nth-child(n + 2) {
                margin-left: 8px;
            }
        }
    }

    .select-all {
        background: #fff;
        user-select: none;

        > th {
            text-align: left;
            padding: 22px 0;
            color: #000;
            font-size: 14px;
            font-style: normal;
            font-weight: 500;
            line-height: 150%;
            padding-left: 12px;

            &:first-child {
                padding-left: 24px;
                padding-right: 12px;
            }
            &:nth-child(2) {
                padding-left: 0;
            }

            &:last-child {
                padding-right: 56px;
                text-align: right;
            }
        }
    }

    .check-box {
        .flex(initial, center, row);

        .no-select,
        .selected {
            font-size: 20px;
            cursor: pointer;
        }
    }

    .invalid-box {
        background: #ddd;
        padding: 4px;
        color: #666;
        font-size: 10px;
        font-style: normal;
        font-weight: 500;
        line-height: 10px;
        position: absolute;
        left: 7px;
        display: none;
    }

    .list {
        min-height: 100px;
    }

    .list-body {
        background: #fff;

        > tr td {
            text-align: left;
            padding: 24px 0 16px 0;
            color: #000;
            font-size: 14px;
            font-style: normal;
            font-weight: 500;
            line-height: 150%;
            padding-left: 12px;

            &:first-child {
                padding-left: 24px;
                padding-right: 12px;
            }

            &:last-child {
                padding-right: 56px;
                text-align: right;
            }
        }
    }

    .row {
        user-select: none;
        &:nth-child(2) {
            .row-item {
                padding-top: 24px;
            }
        }
        &:last-child {
            .row-item {
                padding-bottom: 24px;
            }
        }

        &.row-title {
            > td {
                text-align: left;
                padding: 24px 0 0 0;
                color: #000;
                font-size: 14px;
                font-style: normal;
                font-weight: 500;
                line-height: 150%;
                padding-left: 12px;

                &:first-child {
                    padding-left: 24px;
                }

                &:last-child {
                    padding-right: 56px;
                    text-align: right;
                }
            }
        }

        .row-item {
            margin-right: 10px;
            vertical-align: top;

            &:last-child {
                margin-right: 0;
            }
            &:nth-child(2) {
                padding-left: 0;
            }

            &.operation-row {
                .flex(initial, flex-end, column);
            }

            .row-text {
                color: #000;
                font-size: 14px;
                font-style: normal;
                font-weight: 500;
                line-height: 150%;

                /* 21px */
                &.select-all-text {
                    margin-right: 20px;
                    width: 144px;
                    min-width: 86px;
                }

                &.price {
                    color: #8f00ff;
                    font-size: 20px;
                    font-style: normal;
                    font-weight: 700;
                    line-height: normal;
                    margin-top: 4px;
                    display: inline-block;
                    .original-price {
                        color: #999;
                        font-size: 14px;
                        font-weight: 500;
                        line-height: 21px;
                        text-decoration: line-through;
                        margin-left: 8px;
                    }
                }

                &.delete {
                    color: #ff3636;
                    font-size: 14px;
                    font-style: normal;
                    font-weight: 400;
                    line-height: 150%;
                    margin-top: 8px;
                    cursor: pointer;
                }

                &.unit-price {
                    display: inline-block;
                    margin-top: 5px;
                }
                &.excluding {
                    font-size: 12px;
                    line-height: 24px;
                    white-space: nowrap;
                }
            }

            .count {
                padding: 7px 20px;
                background: #f5f5f5;
                color: #1d2129;
                font-size: 12px;
                font-style: normal;
                font-weight: 500;
                line-height: 18px;
                cursor: pointer;
            }

            .count-edit {
                /deep/.ant-input-number {
                    width: 137px;
                    box-shadow: 0 0 0 0;
                    border: 0;
                    position: relative;
                    text-align: center;
                    background-color: #fff;

                    .ant-input-number-input-wrap {
                        margin: 0 40px;
                        background: #f5f5f5;

                        .ant-input-number-input {
                            color: #1d2129;
                            text-align: center;
                            font-size: 12px;
                            font-style: normal;
                            font-weight: 500;
                            line-height: 27px;
                            /* 135% */
                            height: 32px;
                        }
                    }

                    .ant-input-number-handler-wrap {
                        width: 0;
                        height: 0;
                        position: static;
                        opacity: 1;
                        visibility: hidden;

                        .ant-input-number-handler {
                            .fcc();
                            visibility: visible;
                            height: 32px;
                            width: 32px;
                            background: #f5f5f5;
                            border: none;
                            position: absolute;
                            border: 0;
                            box-sizing: border-box;

                            &:hover {
                                height: 32px !important;
                                opacity: 0.7;
                            }

                            .anticon {
                                display: none;
                            }

                            &.ant-input-number-handler-down {
                                left: 0;

                                &::before {
                                    border-radius: 20px;
                                    display: inline-block;
                                    content: '';
                                    width: 12px;
                                    height: 1px;
                                    background: #1c1b1f;
                                    border-radius: 20px 20px 20px 20px;
                                    opacity: 1;
                                }
                            }

                            &.ant-input-number-handler-up {
                                right: 0;

                                &::before,
                                &::after {
                                    position: absolute;
                                    display: inline-block;
                                    content: '';
                                    background: #1c1b1f;
                                    border-radius: 20px;
                                }

                                &::before {
                                    width: 12px;
                                    height: 1px;
                                }

                                &::after {
                                    height: 12px;
                                    width: 1px;
                                }
                            }
                        }
                    }
                }
            }

            .product {
                .flex(initial, initial, row);

                .product-img {
                    border: 1px solid #eee;
                    width: 120px;
                    height: 120px;
                    min-width: 120px;

                    :deep(.ant-image) {
                        height: 100%;
                        width: 100%;

                        .ant-image-img {
                            object-fit: cover;
                            height: 100%;
                        }
                    }
                }

                .product-mes {
                    margin-left: 24px;

                    .name {
                        .name-text {
                            .ellipsis(1);
                            color: #000;
                            font-size: 20px;
                            font-style: normal;
                            font-weight: 500;
                            line-height: 150%;
                        }
                    }

                    .code {
                        color: #666;
                        font-size: 14px;
                        font-style: normal;
                        font-weight: 400;
                        line-height: 150%;
                        margin-top: 8px;
                    }

                    .version {
                        .flex(initial, center, row);
                        display: inline-flex;
                        color: #333;
                        font-size: 12px;
                        font-style: normal;
                        font-weight: 400;
                        line-height: 150%;
                        padding: 8px;
                        background: #f5f5f5;
                        margin-top: 12px;
                        cursor: pointer;

                        .cart-arrow-right {
                            display: inline-block;
                        }

                        .cart-arrow-right-active {
                            display: none;
                        }

                        .cart-arrow-right,
                        .cart-arrow-right-active {
                            width: 16px;
                            height: 16px;
                            min-width: 16px;
                            margin-left: 24px;
                        }

                        &:hover {
                            color: #8f00ff;

                            .cart-arrow-right {
                                display: none;
                            }

                            .cart-arrow-right-active {
                                display: inline-block;
                            }
                        }
                    }
                }
            }

            &.invalid {
                &:not(:last-child) {
                    opacity: 0.4;
                    user-select: none;
                    pointer-events: none;
                }

                &:last-child {
                    .operation {
                        .price {
                            opacity: 0.4;
                            user-select: none;
                            pointer-events: none;
                        }
                    }
                }

                .check-box {
                    display: none;
                }

                .invalid-box {
                    display: block;
                }
            }
        }

        .row-item-check {
            vertical-align: inherit;
        }
    }
    .gift {
        position: relative;
        &::after {
            content: '';
            display: inline-block;
            height: 16px;
            background: #fff;
            width: 100%;
            position: absolute;
            left: 0;
            bottom: 0px;
        }
        &:last-child {
            .row-item {
                padding-bottom: 40px;
            }
        }
        .row-item {
            background: #fafafa;
            padding: 24px 0 40px 12px;
            &:first-child {
                width: 44px;
            }
            &:nth-child(2) {
                padding-left: 24px;
            }
            .product {
                .product-img {
                    width: 96px;
                    height: 96px;
                    min-width: 96px;
                }
                .product-mes {
                    .name {
                        .fcc();
                        .label {
                            margin-left: 12px;
                            border: 1px solid #c6f;
                            display: inline-flex;
                            padding: 4px 8px;
                            justify-content: center;
                            align-items: center;
                            font-size: 10px;
                            font-style: normal;
                            font-weight: 500;
                            line-height: 10px;
                            background: linear-gradient(100deg, #c6f 0%, #66f 100%);
                            background-clip: text;
                            -webkit-background-clip: text;
                            -webkit-text-fill-color: transparent;
                        }
                    }
                }
            }
            .count-edit {
                .count-number {
                    padding: 7px 20px;
                    background: #f5f5f5;
                    font-size: 16px;
                    font-weight: 500;
                    line-height: 24px;
                }
            }
        }
        .row-item-check {
            background: #fff;
        }
    }
    .seize {
        height: 24px;
        width: 100%;
        display: table-row-group;
    }

    .operation {
        width: 100%;
        .flex(initial, flex-end, column);
    }
}
</style>
<!-- 弹窗样式 -->
<style lang="less">
.version-drawer {
    .ant-drawer-body {
        padding: 0;
        background: #f8f8f8;
    }

    .drawer {
        max-width: 700px;
        margin: 0 auto;
        height: 100%;
        overflow-y: auto;
        padding-top: 40px;
        padding-bottom: 72px;
        &::-webkit-scrollbar {
            width: 0;
        }

        .vehicle-body-series {
            margin-bottom: 40px;
            .series-cards {
                .flex(initial, initial, row);
                overflow-x: auto;

                &.padding-bottom {
                    padding-bottom: 24px;
                }

                .series-card {
                    flex-shrink: 0;
                    min-width: calc((100% - 32px) / 3);
                    width: 207px;

                    &:nth-child(n + 2) {
                        margin-left: 16px;
                    }
                }
            }

            .variants {
                .nums {
                    color: #666;
                    text-align: right;
                    font-size: 16px;
                    font-style: normal;
                    font-weight: 400;
                    line-height: 150%;
                    /* 24px */
                    margin: 24px 0 12px 0;
                }

                .variants-body {
                    max-height: calc((130px + 16px) * 3 + (130px) / 2);
                    overflow-y: auto;

                    /* 滚动条 */
                    &::-webkit-scrollbar {
                        height: 0px;
                        width: 0px;
                    }

                    .variants-item {
                        cursor: pointer;

                        &:nth-child(n + 2) {
                            margin-top: 16px;
                        }
                    }
                }
            }
        }
    }

    .drawer-footer {
        position: absolute;
        bottom: 0;
        left: 0;
        margin: 0 auto;
        height: 72px;
        width: 100%;
        background: #fff;

        .drawer-footer-body {
            .flex(initial, center, row);
            max-width: 700px;
            margin: 0 auto;
            height: 100%;

            #my-button {
                flex: 1;

                &:nth-child(n + 2) {
                    margin-left: 24px;
                }
            }
        }
    }
}
</style>
