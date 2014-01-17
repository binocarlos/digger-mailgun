/*

	(The MIT License)

	Copyright (C) 2005-2013 Kai Davenport

	Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 */

var Supplier = require('digger-supplier');
var Mailgun = require('mailgun').Mailgun;
var async = require('async');

module.exports = function(options){

	options = options || {};

	var apikey = options.apikey || process.env.DIGGER_MAILGUN_KEY;
	var domain = options.domain || process.env.DIGGER_MAILGUN_DOMAIN;

	var mg = new Mailgun(apikey);

	var supplier = Supplier(options);

	supplier.on('append', function(req, reply){

		async.forEach(req.body || [], function(email, nextemail){

			mg.sendText(
				email.from,
        [email.to],
        email.subject,
        email.body,
        function(err){
        	nextemail(err);
        })

		}, function(error){
			reply(error, req.body || []);
		})
	})

	return supplier;
}