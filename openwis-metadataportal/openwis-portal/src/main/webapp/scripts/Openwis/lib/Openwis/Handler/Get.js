Ext.ns('Openwis.Handler');

Openwis.Handler.Get = Ext.extend(Ext.util.Observable, {
	constructor: function(config) {
        this.url = config.url;
        if (typeof(config.params) == 'number') {
        	this.params = config.params + '';
        } else {
			this.params = config.params || {};
		}
		this.maskEl = config.maskEl ? config.maskEl : Ext.getBody();
		this.useLoadMask = (config.useLoadMask !== undefined) ? config.useLoadMask : true;
		
        this.addEvents("success", "failure");
        this.listeners = config.listeners;

        // Call our superclass constructor to complete construction process.
        Openwis.Handler.Get.superclass.constructor.call(this, config)
    },
	
	proceed: function() {
	    if(this.useLoadMask) {
		    this.loadMask = new Ext.LoadMask(this.maskEl, {msg:"Loading... Please wait..."});
		    this.loadMask.show();
		}
		Ext.Ajax.request({
			url: this.url,
			success: this.cbSuccessful,
			failure: this.cbFailure,
			method: "POST",
			headers: {
			   'Content-Type': 'application/json; charset=utf-8',
			   'Accept':'application/json; charset=utf-8'
			},
			jsonData: this.params,
			scope: this
		});
	},
	
	cbSuccessful: function(ajaxResponse) {
	    if(this.useLoadMask) {
		    this.loadMask.hide();
		}
		var responseHandler = new Openwis.Data.JeevesJsonResponseHandler();
		var response = responseHandler.handleResponse(ajaxResponse);
		this.fireSuccessEvent(response);
	},
	
	fireSuccessEvent: function(response) {
		this.fireEvent("success", response);
	},
	
	cbFailure: function(response) {
	    if(this.useLoadMask) {
		    this.loadMask.hide();
		}
		if (response.status == 401) {
			//display Session Expired -> button reconnect
			new Openwis.Utils.MessageBoxServiceNotAllowed();
		} else {
			Openwis.Utils.MessageBox.displayInternalError(this.fireFailureEvent, this);
		}
		
	},
	
	fireFailureEvent: function() {
		this.fireEvent("failure");
	}
});