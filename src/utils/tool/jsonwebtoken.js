import jwt from 'jsonwebtoken'
const publicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDI9xeCPtV3C5efL7kZ7KzIxHuvJJD2ffAH4MAy+sbe45QkgPO+cObpnwDTM+WAw11/KxZCjO4zOCXfqEkYgpopR2J+WwWGIWtYSBmCFtm81GLp8XtJUMq9F2kUqluyi1t+e4hKbZJHkmgLBJWus3zjIJPIAuApVjV4E5xYOJlDawIDAQAB'
export default {
    tokenDecode:(token)=>{
        return jwt.decode(token, publicKey)
    },
    tokenVerify:(token)=>{
        // invalid token
        let isVerify = false
        jwt.verify(token, publicKey, function (err, decoded) {
            // err
            // decoded undefined
            isVerify = true
        })
        return isVerify
    }
}
