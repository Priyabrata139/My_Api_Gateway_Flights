async function info(req, res) {
    try {
       
        return res
                .json({
                    message: 'api is live'
                });
    } catch(error) {
        
        return res
                .json(error);
    }
}

module.exports={
    info
}