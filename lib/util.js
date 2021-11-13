import _ from 'lodash-es';


export const getSum = (c) => {
    return _.sum(
        c.split('.')
            .map((s, i, all) => {
                return i < all.length -1 ? +s*Math.pow(10, all.length-i) : +s;
            })
    );
};
