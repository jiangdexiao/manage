export default{
   permission:(content)=>{
        let perms = sessionStorage.getItem('perms')
        if(perms.indexOf(content)=== -1){
            return false
        }else{
            return true
        }
    }
}