
import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { expect } from 'chai';
// import Avatar from '../src/features/Avatar/Avatar.js';
import assert from 'node:assert/strict';

let rootContainer;
// create div
beforeEach(() => {
    rootContainer = document.createElement('div');
    document.body.appendChild(rootContainer);
});
// remove div
afterEach(() => {
    document.body.removeChild(rootContainer);
    rootContainer = null;
});

describe('Avatar', function () {
    it('should return an img tag w/ svg src', function () {
        // test if the component is rendered and mounted
        act(() => {
            ReactDOM.render(<Avatar />, rootContainer);
        });
        // assert that img src is svg

        const img = rootContainer.querySelector('img');

        expect(img.src).to.include('svg');
        // data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%205%205%22%20fill%3D%22none%22%20shape-rendering%3D%22crispEdges%22%20width%3D%2228%22%20height%3D%2228%22%3E%3Cdesc%3E%22Identicon%22%20by%20%22Florian%20K%C3%B6rner%22%2C%20licensed%20under%20%22CC0%201.0%22.%20%2F%20Remix%20of%20the%20original.%20-%20Created%20with%20dicebear.com%3C%2Fdesc%3E%3Cmetadata%20xmlns%3Adc%3D%22http%3A%2F%2Fpurl.org%2Fdc%2Felements%2F1.1%2F%22%20xmlns%3Acc%3D%22http%3A%2F%2Fcreativecommons.org%2Fns%23%22%20xmlns%3Ardf%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%22%3E%3Crdf%3ARDF%3E%3Ccc%3AWork%3E%3Cdc%3Atitle%3EIdenticon%3C%2Fdc%3Atitle%3E%3Cdc%3Acreator%3E%3Ccc%3AAgent%20rdf%3Aabout%3D%22https%3A%2F%2Fdicebear.com%22%3E%3Cdc%3Atitle%3EFlorian%20K%C3%B6rner%3C%2Fdc%3Atitle%3E%3C%2Fcc%3AAgent%3E%3C%2Fdc%3Acreator%3E%3Cdc%3Asource%3Ehttps%3A%2F%2Fdicebear.com%3C%2Fdc%3Asource%3E%3Ccc%3Alicense%20rdf%3Aresource%3D%22https%3A%2F%2Fcreativecommons.org%2Fpublicdomain%2Fzero%2F1.0%2F%22%20%2F%3E%3C%2Fcc%3AWork%3E%3C%2Frdf%3ARDF%3E%3C%2Fmetadata%3E%3Cmask%20id%3D%22viewboxMask%22%3E%3Crect%20width%3D%225%22%20height%3D%225%22%20rx%3D%220%22%20ry%3D%220%22%20x%3D%220%22%20y%3D%220%22%20fill%3D%22%23fff%22%20%2F%3E%3C%2Fmask%3E%3Cg%20mask%3D%22url(%23viewboxMask)%22%3E%3Cpath%20d%3D%22M0%200h1v1H0V0ZM4%200h1v1H4V0ZM3%200H2v1h1V0Z%22%20fill%3D%22%23c4c4c4%22%2F%3E%3Cpath%20d%3D%22M2%201H0v1h2V1ZM5%201H3v1h2V1Z%22%20fill%3D%22%23c4c4c4%22%2F%3E%3Cpath%20d%3D%22M2%202H1v1h1V2ZM4%202H3v1h1V2Z%22%20fill%3D%22%23c4c4c4%22%2F%3E%3Cpath%20d%3D%22M2%203H0v1h2V3ZM5%203H3v1h2V3Z%22%20fill%3D%22%23c4c4c4%22%2F%3E%3Cpath%20fill%3D%22%23c4c4c4%22%20d%3D%22M1%204h3v1H1z%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E
        // document.querySelector('div.card-body > img').getAttribute('src').match(/(?<=viewboxMask).*/)[0]


        // assert.match('<img src="data:image/svg+xml;utf8,%3Csvg%20xmlns%3%%3C%2Fsvg%3E" alt="Avatar">', 
        // /<img src="data:image\/svg\+xml;utf8,.*alt="Avatar"/);
    });
});
