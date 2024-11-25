export const blank = (value) => !value;
export const empty = (value) => value.length === 0;
export const none = (value) => value === null;
export const integer = (value) => !parseInt(value) && value !== 0 && !!value;
export const decimal = (value) => !parseFloat(value) && value !== 0.0 && !!value;
export const underage = (value) => parseInt(value) < 13;
export const invalidgpa = (value) => parseFloat(value) < 0.0 || parseFloat(value) > 4.0;
export const max50 = (value) => value.length > 50 && value.length !== 0;
export const max100 = (value) => value.length > 100 && value.length !== 0;
export const max150 = (value) => value.length > 150 && value.length !== 0;
export const one = (value) => parseInt(value) < 1;
export const email = (value) => !value.match('[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?');

export const password = (value) => {
    const invalid = {
        length: value.length < 12,
        upper: !value.match('.*[A-Z].*'),
        lower: !value.match('.*[a-z].*'),
        number: !value.match('.*[0-9].*'),
        special: !value.match(/.*[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~].*/),
        only: !value.match(/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~A-Za-z0-9]+/)
    }
    return {
        ...invalid,
        all: Object.values(invalid).some(Boolean)
    }
}