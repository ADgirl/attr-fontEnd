<style lang="less">
    @import './language-switch.less';
</style>
<template>
    <div style="display:inline-block;padding:0 6px;">
        <Dropdown trigger="hover" @on-click="setLanguage">
            <a href="javascript:void(0)">
                <Icon :style="{marginTop: '-2px', verticalAlign: 'middle'}" color="#495060" :size="18" type="earth"></Icon>
                <Icon type="arrow-down-b"></Icon>
            </a>
            <DropdownMenu slot="list">
                <DropdownItem v-for="(item, index) in languageList" :key="index" :name="item.id">
                    {{item.name}}
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    </div>
</template>
<script>
export default {
    name: 'languageSwitch',
    data(){
        return{
            languageList:[
                {
                    name: '中文简体',
                    id: 'zh-CN'
                },
                {
                    name: '中文繁体',
                    id: 'zh-TW'
                },
                {
                    name: 'English',
                    id: 'en-US'
                }
            ]
        }
    },
    methods:{
        setLanguage: function(){

        },
    }
}
</script>
