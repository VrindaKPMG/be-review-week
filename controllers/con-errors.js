exports.handle404 = (req, res, next) => {
    res.status(404).send({msg: 'Path not found :( Try again.'})
}

exports.handleOtherErrors = (err, req, res, next) => {
    if (err.code === '22P02' || err.code === '23502') {
        res.status(400).send({msg : 'wrong request'})
    }
    if (err.code === '23503') {
        res.status(404).send({msg : 'not found'})
    }
    if (err.msg && err.status) {
        res.status(err.status).send({msg: err.msg})
    }
}

exports.handle500 = (err, req, res, next) => {
    res.status(500).send({msg : 'something is wrong'})
}


