<template>
    <div id="part">
                    
        <div class="form-block">
                <!-- 基本信息 -->
                <div class="form-title">
                    <div class="title">{{ $t("n.information") }}</div>
                </div>
                <div class="form-content">
                    <!-- 名称  v-if="this.specific.mode === 1"-->
                    <div class="form-item required">
                        <div
                            class="key"
                        >
                            {{ $t("n.name") }}
                        </div>
                        <div class="value">
                            <a-input
                                :placeholder="$t('def.input')"
                                :maxlength="50"
                            />
                        </div>
                    </div>
                    <!-- 英文名 v-if="this.specific.mode === 1" -->
                    <div class="form-item required">
                        <div
                            class="key"
                        >
                            {{ $t("n.name_en") }}
                        </div>
                        <div class="value">
                            <a-input
                                :placeholder="$t('def.input')"
                                :maxlength="50"
                            />
                        </div>
                    </div>
                    <!-- 颜色 -->
                    <div class="form-item">
                        <div class="key">{{ $t("d.color") }}</div>
                        <div class="value">
                            <a-input
                                :placeholder="$t('def.input')"
                            />
                        </div>
                    </div>
                    <!-- 颜色英文 -->
                    <div class="form-item">
                        <div class="key">{{ $t("d.color_en") }}</div>
                        <div class="value">
                            <a-input
                                :placeholder="$t('def.input')"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div class="form-block">
                <div class="form-title">
                    <div  class="title">
                        {{ $t("supply-chain.contact") }}
                    </div>
                </div>
                <div class="form-content">
                    <div class="form-item">
                        <div class="key">{{ $t("i.mode") }}</div>
                        <div class="value" >
                            <a-form-item has-feedback name="pass">
                                <a-input type="password" autocomplete="off" />
                            </a-form-item>
                        </div>
                    </div>
                    <div class="form-item">
                        <div class="key">{{ $t("i.mode") }}</div>
                        <div class="value">
                            <a-form-item has-feedback name="pass">
                                <a-input  type="password" autocomplete="off" />
                            </a-form-item>
                        </div>
                    </div>
                    <div class="form-item">
                        <div class="key">{{ $t("i.mode") }}</div>
                        <div class="value" >
                            <a-form-item has-feedback  name="checkPass">
                                <a-input  type="password" autocomplete="off" />
                            </a-form-item>
                        </div>
                    </div>
                    <div class="form-item">
                        <div class="key">{{ $t("i.mode") }}</div>
                        <div class="value" >
                            <a-form-item has-feedback  name="age">
                                <a-input-number />
                            </a-form-item>
                        </div>
                    </div>

                </div>
            </div>
    </div>
</template>
<script>

</script>
<style lang="less" scoped>
    #part {

    }      
</style>