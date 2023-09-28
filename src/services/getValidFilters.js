export const getValidFilters = (filters,documentType) => {
    const cleanFilter = {};
    switch(documentType){
        case "product":{
            if(filters.category){
                if(typeof category === "string"){
                    cleanFilter['category'] = {$in:[filters.category]}
                }
                else{
                    cleanFilter['category'] = {$in:filters.category}
                }
            }
            if(filters.gte){
                cleanFilter['price'] = {$gte:filters.gte}
            }
            if(filters.price){
                cleanFilter['price'] = filters.price
            }
            return cleanFilter;
        }
    }
}