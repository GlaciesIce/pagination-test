<template>
    <div class="row">
        <div class="col-md-3 col-xl-2" style="border-right: 1px solid #D8D8D8">
            <sidebar></sidebar>
        </div>
        <div class="col-md-9 col-xl-10">
            <vue-universal-table
                api_url="/"
                sort_by="id"
                sort_order="asc"
            ></vue-universal-table>
        </div>
    </div>
</template>

<script>
    import sidebar from './Docs/Sidebar'

    export default {
        data () {
            return {

            }
        },
        components : {
            sidebar
        },
        mounted () {

        },
        methods : {

        }
    }
</script>

<style scoped>

</style>