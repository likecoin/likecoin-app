global.Buffer = require('buffer').Buffer
if(!global.TextEncoder) global.TextEncoder = require('text-encoding').TextEncoder
if(!global.TextDecoder) global.TextDecoder = require('text-encoding').TextDecoder
global.process = require('process')
if (!global.BigInt) global.BigInt = require('big-integer')
