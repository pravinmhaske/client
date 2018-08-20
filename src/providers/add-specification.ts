export class AddProductsSpecification {
    formatProducts(productsList, specifications) {
        productsList.forEach(product => {
            if(product.rating) {
                product.star = Math.round(((product.rating.split(',').reduce(function(a, b) {
                    return Number(a) + Number(b);
                }, 0)) / product.rating.split(',').length));
            }
            product.specifications = [];
            if(product.specids) {
                specifications.filter(specObj => {
                    product.specids.split(',').filter(specId => {
                        if(product.specifications.length == 0 && specObj.specId == specId) {
                            product.specifications.push({name:specObj.spec, values:[specObj.value]});
                        } else if(product.specifications.length != 0 && specObj.specId == specId) {
                            var index;
                            if(product.specifications.find((obj, i) => {
                                if(obj.name == specObj.spec) {index = i;return true;}})
                                ) {
                                if(index>=0) product.specifications[index].values.push(specObj.value);
                            } else {
                                product.specifications.push({name:specObj.spec, values:[specObj.value]});
                            }
                        }
                    });
                });
            }
        });
        return productsList;
    }
}