function cmpTime(a,b) {
    if (a.time === b.time)
        return 0;
    if (a.time < b.time)
        return 1;
    return -1;
};

export {cmpTime};