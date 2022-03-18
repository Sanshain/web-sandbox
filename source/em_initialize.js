import expand, {extract} from 'emmet';

export default function extend (code) {
    let text = expand(code)
    return text
}