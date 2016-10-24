var JSONTreeParser={};

/**
 * json格式转树状结构 
 * @param   {json}      json数据 
 * @param   {String}    id的字符串 
 * @param   {String}    父id的字符串 
 * @param   {String}    children的字符串 
 * @return  {Array}     数组 
 */

JSONTreeParser.parse = function (a, idStr, pidStr, chindrenStr){
    var r = [], hash = {}, id = idStr, pid = pidStr, children = chindrenStr, i = 0, j = 0, len = a.length;  
    for(; i < len; i++){  
        hash[a[i][id]] = a[i];  
    }  
    for(; j < len; j++){  
        var aVal = a[j], hashVP = hash[aVal[pid]];  
        if(hashVP){  
            !hashVP[children] && (hashVP[children] = []);  
            hashVP[children].push(aVal);  
        }else{  
            r.push(aVal);  
        }  
    }  
    return r;  
}  

//测试数据
//var jsonData = [ { _id: '55b994ddbdda9765bd6defd4', categoryName: '童鞋' },
//    { _id: '55b99514bdda9765bd6defd5',categoryName: '运动鞋',parentId: '55b994ddbdda9765bd6defd4' },
//    { _id: '55b9952abdda9765bd6defd6',categoryName: '家居鞋',parentId: '55b994ddbdda9765bd6defd4' },
//    { _id: '55b99542bdda9765bd6defd7', categoryName: '童装' },
//    { _id: '55b99573bdda9765bd6defd8',categoryName: '裤子',parentId: '55b99542bdda9765bd6defd7' },
//    { _id: '55b995ebbdda9765bd6defd9',categoryName: '衬衫',parentId: '55b99542bdda9765bd6defd7' } ]
//
//var jsonDataTree = parse(jsonData, '_id', 'parentId', 'children');
//console.log(jsonDataTree);

if(typeof module != "undefined"){
    module.exports = JSONTreeParser;
}