const isAdminAuth = (req,res,next)=>{ 
    const token="xyz";
    const isAuth = token==="xyz";
    if(!isAuth){
        res.status(403).send("Invalid Token");
    }
    else next();
};

const isUserinAuth = (req,res,next)=>{
    const token="xyz";
    const isAuth = token==="xyz";
    if(!isAuth){
        res.status(403).send("Invalid Token");
    }
    else next();
}

module.exports = {
    isAdminAuth,
    isUserinAuth,
}