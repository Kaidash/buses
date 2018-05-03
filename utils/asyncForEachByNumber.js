const asyncForEachByNumber = async (number, callback) => {
    for (var index = 0; index < number; index++) {
        console.log(number, index, 'number index');
        await callback(index);
    }
};
module.exports = asyncForEachByNumber;
