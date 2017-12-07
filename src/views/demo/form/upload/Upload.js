export default {
    data(){
        return{
            img:{
                imageUrl:'',
                imgGroup:'1'
            }
        }
    },
    methods:{
        uploadSuccess(res){
            console.log(res)
        }
    }
}