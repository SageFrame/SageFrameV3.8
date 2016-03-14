(function ($) {
    $.PaymentGateway = function (p) {
        var order = 0;
        var level = 0;
        p = $.extend
                ({
                    CultureCode: '',
                    UserModuleID: '1'
                }, p);
        var PaymentGateway = {
            config: {
                async: false,
                cache: false,
                type: 'POST',
                contentType: "application/json; charset=utf-8",
                data: '{}',
                dataType: 'json',
                method: "",
                url: "",
                categoryList: "",
                ajaxCallMode: 0,
                arr: [],
                arrModules: [],
                baseURL: SageFrameAppPath + '/Modules/Admin/PaymentGateway/Services/PaymentGateway.asmx/',
                Path: SageFrameAppPath + '/Modules/Admin/PaymentGateway/',
                PortalID: SageFramePortalID,
                UserName: SageFrameUserName,
                UserModuleID: p.UserModuleID,
                row: '<tr><td><input type="text" class="SettingKey" /></td><td><input type="text" class="SettingValue" /></td><td><span class="sfDelete deleterow icon-delete"></span></td></tr>'
            },
            init: function () {
                // alert('hi');
                PaymentGateway.LoadPaymentgateays();
                $('#btnAddPaymentGateway').on('click', function () {
                    PaymentGateway.Hide(3);
                });
                $('#btnCancelPaymentCreate').on('click', function () {
                    PaymentGateway.Hide(8);
                });
                $('#btnCreatePayment').on('click', function () {
                    var paymentName = $('#txtPaymentGatewayName').val();
                    if (paymentName.length != 0) {
                        PaymentGateway.CheckDuplicateGatewayName(paymentName);
                    }
                    else {
                        SageFrame.messaging.show("Payment name can't be empty", "Error");
                    }
                });
                $('#AddRow').on('click', function () {
                    PaymentGateway.AppendNewRow();
                });
                $('#CancelEdit').on('click', function () {
                    PaymentGateway.ClearGatewayTable();
                    PaymentGateway.ClearSettingTable
                    PaymentGateway.Hide(4);
                });
                $('#SaveEdit').on('click', function () {
                    PaymentGateway.SavePaymentGatewaySettings();
                });

                $('#deleteSelectedPayment').on('click', function () {


                    var paymentNameList = [];
                    $('.chkSelect').each(function () {
                        var $self = $(this);
                        if ($(this).is(':checked')) {
                            var paymentName = $self.parents('tr').find('td').eq(1).find('.keyName').text();
                            paymentNameList.push(paymentName);
                        }
                    });
                    if (paymentNameList.length > 0) {
                        jConfirm('Are you sure you want to delete Payment Gateways settings ?', 'Confirmation Dialog', function (r) {
                            if (r) {
                                PaymentGateway.DeleteSelectedPaymentName(paymentNameList);
                            }
                        });
                    }

                });
            },

            DeleteSelectedPaymentName: function (paymentNameList) {
                PaymentGateway.config.method = "LoadPaymentGateways";
                PaymentGateway.config.url = PaymentGateway.config.baseURL + PaymentGateway.config.method;
                PaymentGateway.config.data = JSON2.stringify({
                    PortalID: SageFramePortalID,
                    UserModuleID: PaymentGateway.config.UserModuleID,
                    UserName: SageFrameUserName,
                    SecureToken: SageFrameSecureToken
                });
                $.ajax({
                    type: PaymentGateway.config.type,
                    url: PaymentGateway.config.url,
                    contentType: PaymentGateway.config.contentType,
                    data: PaymentGateway.config.data,
                    dataType: PaymentGateway.config.dataType,
                    async: PaymentGateway.config.async,
                    success: function (msg) {
                        var data = msg.d;
                        var isDuplicate = false;
                        var parsedData = {};
                        if (data != null) {
                            parsedData = jQuery.parseJSON(data.SettingValue);
                            $.each(paymentNameList, function (index, value) {
                                for (var key in parsedData) {
                                    if (key.toLowerCase().trim() == value.toLowerCase().trim()) {
                                        delete parsedData[key];
                                        return;
                                    }
                                }
                            });
                            PaymentGateway.SaveGateway(parsedData);
                        }
                    },
                    error: function (msg) { PaymentGateway.ajaxFailure(); }
                });
            },


            DeletePaymentName: function () {
                $(".paymentDelete").off().on("click", function () {
                    var $self = $(this);
                    var paymentName = $self.parents('tr').find('td').eq(1).find('.keyName').text();
                    jConfirm('Are you sure you want to delete ' + paymentName + ' ?', 'Confirmation Dialog', function (r) {
                        if (r) {
                            
                            PaymentGateway.config.method = "LoadPaymentGateways";
                            PaymentGateway.config.url = PaymentGateway.config.baseURL + PaymentGateway.config.method;
                            PaymentGateway.config.data = JSON2.stringify({
                                PortalID: SageFramePortalID,
                                UserModuleID: PaymentGateway.config.UserModuleID,
                                UserName: SageFrameUserName,
                                SecureToken: SageFrameSecureToken
                            });
                            $.ajax({
                                type: PaymentGateway.config.type,
                                url: PaymentGateway.config.url,
                                contentType: PaymentGateway.config.contentType,
                                data: PaymentGateway.config.data,
                                dataType: PaymentGateway.config.dataType,
                                async: PaymentGateway.config.async,
                                success: function (msg) {
                                    var data = msg.d;
                                    var isDuplicate = false;
                                    var parsedData = {}; 
                                    if (data != null) {
                                        parsedData = jQuery.parseJSON(data.SettingValue);
                                       
                                        for (var key in parsedData) {
                                            if (key.toLowerCase().trim() == paymentName.toLowerCase().trim()) {
                                                delete parsedData[key];
                                                PaymentGateway.SaveGateway(parsedData);
                                                return;
                                            }
                                        }
                                    }
                                },
                                error: function (msg) { PaymentGateway.ajaxFailure(); }
                            });
                        }
                    });
                });
            },


            SaveGateway: function (data) {
                this.config.method = "SavePaymentGateways";
                this.config.url = PaymentGateway.config.baseURL + this.config.method;
                this.config.data = JSON2.stringify({
                    PortalID: SageFramePortalID,
                    UserModuleID: PaymentGateway.config.UserModuleID,
                    UserName: SageFrameUserName,
                    SecureToken: SageFrameSecureToken,
                    SettingValue: JSON2.stringify(data)
                });
                this.config.ajaxCallMode = 1;
                this.ajaxCall(this.config);
            },

            CheckDuplicateGatewayName: function (paymentName) {
                this.config.method = "LoadPaymentGateways";
                this.config.url = PaymentGateway.config.baseURL + this.config.method;
                this.config.data = JSON2.stringify({
                    PortalID: SageFramePortalID,
                    UserModuleID: PaymentGateway.config.UserModuleID,
                    UserName: SageFrameUserName,
                    SecureToken: SageFrameSecureToken
                });
                $.ajax({
                    type: PaymentGateway.config.type,
                    url: PaymentGateway.config.url,
                    contentType: PaymentGateway.config.contentType,
                    data: PaymentGateway.config.data,
                    dataType: PaymentGateway.config.dataType,
                    async: PaymentGateway.config.async,
                    success: function (msg) {
                        var data = msg.d;
                        var isDuplicate = false;
                        var parsedData = {};
                        if (data != null) {
                            parsedData = jQuery.parseJSON(data.SettingValue);
                            PaymentGateway.ClearSettingTable();
                            for (var key in parsedData) {
                                if (key.toLowerCase().trim() == paymentName.toLowerCase().trim()) {
                                    isDuplicate = true;
                                }
                            }
                        }
                        if (isDuplicate) {
                            SageFrame.messaging.show("Duplicate Payment Gateway Name", "Error");
                        }
                        else {
                            PaymentGateway.SavePaymentGatewayName(paymentName, parsedData);
                        }

                    },
                    error: function (msg) { PaymentGateway.ajaxFailure(); }
                });
            },

            SavePaymentGatewayName: function (paymentName, data) {
                if (data != null) {
                    data[paymentName] = null;
                }
                this.config.method = "SavePaymentGateways";
                this.config.url = PaymentGateway.config.baseURL + this.config.method;
                this.config.data = JSON2.stringify({
                    PortalID: SageFramePortalID,
                    UserModuleID: PaymentGateway.config.UserModuleID,
                    UserName: SageFrameUserName,
                    SecureToken: SageFrameSecureToken,
                    SettingValue: JSON2.stringify(data)
                });
                $.ajax({
                    type: PaymentGateway.config.type,
                    url: PaymentGateway.config.url,
                    contentType: PaymentGateway.config.contentType,
                    data: PaymentGateway.config.data,
                    dataType: PaymentGateway.config.dataType,
                    async: PaymentGateway.config.async,
                    success: function (msg) {
                        $('#Header').text(paymentName);
                        PaymentGateway.Hide(5);
                        PaymentGateway.AppendNewRow();
                        PaymentGateway.BindDeleteSettingRow();
                    },
                    error: function (msg) { PaymentGateway.ajaxFailure; }
                });
            },

            SavePaymentGatewaySettings: function () {
                this.config.method = "LoadPaymentGateways";
                this.config.url = PaymentGateway.config.baseURL + this.config.method;
                this.config.data = JSON2.stringify({
                    PortalID: SageFramePortalID,
                    UserModuleID: PaymentGateway.config.UserModuleID,
                    UserName: SageFrameUserName,
                    SecureToken: SageFrameSecureToken
                });
                $.ajax({
                    type: PaymentGateway.config.type,
                    url: PaymentGateway.config.url,
                    contentType: PaymentGateway.config.contentType,
                    data: PaymentGateway.config.data,
                    dataType: PaymentGateway.config.dataType,
                    async: PaymentGateway.config.async,
                    success: function (msg) {
                        var data = msg.d;
                        var parsedData = jQuery.parseJSON(data.SettingValue);
                        var gatewayName = $('#Header').text();

                        var settingKeys = {};
                        var isEmpty = false;
                        $('#tblpayment tbody tr').each(function (index, value) {
                            var settingKey = $(this).find('td').eq(0).find('.SettingKey').val();
                            var settingValue = $(this).find('td').eq(1).find('.SettingValue').val();
                            if (settingKey == null || settingKey.trim().length == 0) {
                                SageFrame.messaging.show("The gateway setting key can't be empty", "Error");
                                isEmpty = true;
                                return;
                            }
                            if (settingValue == null || settingValue.trim().length == 0) {
                                SageFrame.messaging.show("The gateway setting Value can't be empty", "Error");
                                isEmpty = true;
                                return;
                            }
                            if (!isEmpty) {
                                settingKeys[settingKey] = settingValue;
                            }
                        });
                        if (!isEmpty) {
                            for (var key in parsedData) {
                                if (key == gatewayName) {
                                    parsedData[gatewayName] = settingKeys;
                                    PaymentGateway.SavePaymentGatewaySetingKeyValue(gatewayName, parsedData);
                                }
                            }
                        }
                        else {

                        }
                    },
                    error: function (msg) { PaymentGateway.ajaxFailure(); }
                });
            },


            SavePaymentGatewaySetingKeyValue: function (gatewayName, data) {
                this.config.method = "SavePaymentGateways";
                this.config.url = PaymentGateway.config.baseURL + this.config.method;
                this.config.data = JSON2.stringify({
                    PortalID: SageFramePortalID,
                    UserModuleID: PaymentGateway.config.UserModuleID,
                    UserName: SageFrameUserName,
                    SecureToken: SageFrameSecureToken,
                    SettingValue: JSON2.stringify(data)
                });
                $.ajax({
                    type: PaymentGateway.config.type,
                    url: PaymentGateway.config.url,
                    contentType: PaymentGateway.config.contentType,
                    data: PaymentGateway.config.data,
                    dataType: PaymentGateway.config.dataType,
                    async: PaymentGateway.config.async,
                    success: function (msg) {
                        SageFrame.messaging.show(gatewayName + " settings key value save succesfuly", "Success");
                        PaymentGateway.Hide(4);
                        PaymentGateway.BindDeleteSettingRow();
                        PaymentGateway.ClearSettingTable();

                    },
                    error: function (msg) { PaymentGateway.ajaxFailure; }
                });
            },

            ClearGatewayTable: function () {
                $('.tblPaymentGatewayList tbody tr').each(function () {
                    $(this).remove();
                });
            },

            ClearSettingTable: function () {
                $('#tblpayment tbody tr').each(function () {
                    $(this).remove();
                });
            },
            AppendNewRow: function () {
                $('#tblpayment').append(PaymentGateway.config.row);
                PaymentGateway.BindDeleteSettingRow();
            },

            BindDeleteSettingRow: function () {
                $('.deleterow').off().on('click', function () {
                    var self = $(this);
                    var length = $('#tblpayment tbody tr').length;
                    if (length > 1) {

                        jConfirm('Are you sure you want to delete the setting ?', 'Confirmation Dialog', function (r) {
                            if (r) {
                                self.parents('tr').remove();
                            }
                        });
                    }
                    else {
                        SageFrame.messaging.show("Can't empty the gateway setting", "Error");
                    }
                });
            },
            LoadPaymentgateays: function () {
                this.config.method = "LoadPaymentGateways";
                this.config.url = PaymentGateway.config.baseURL + this.config.method;
                this.config.data = JSON2.stringify({
                    PortalID: SageFramePortalID,
                    UserModuleID: PaymentGateway.config.UserModuleID,
                    UserName: SageFrameUserName,
                    SecureToken: SageFrameSecureToken
                });
                this.config.ajaxCallMode = 0;
                this.ajaxCall(this.config);
            },

            EditPaymentGatewaySettings: function (gatewayName) {
                this.config.method = "LoadPaymentGateways";
                this.config.url = PaymentGateway.config.baseURL + this.config.method;
                this.config.data = JSON2.stringify({
                    PortalID: SageFramePortalID,
                    UserModuleID: PaymentGateway.config.UserModuleID,
                    UserName: SageFrameUserName,
                    SecureToken: SageFrameSecureToken
                });
                $.ajax({
                    type: PaymentGateway.config.type,
                    url: PaymentGateway.config.url,
                    contentType: PaymentGateway.config.contentType,
                    data: PaymentGateway.config.data,
                    dataType: PaymentGateway.config.dataType,
                    async: PaymentGateway.config.async,
                    success: function (msg) {
                        var data = msg.d;
                        var parsedData = jQuery.parseJSON(data.SettingValue);
                        $('#Header').text(gatewayName);
                        PaymentGateway.ClearSettingTable();
                        for (var key in parsedData) {
                            if (key == gatewayName) {
                                var parsedSettings = parsedData[key];
                                if (parsedSettings != null) {
                                    for (var settings in parsedSettings) {
                                        var tr = '<tr><td><input type="text" class="SettingKey" value="' + settings + '" /></td><td><input type="text" class="SettingValue"  value="' + parsedSettings[settings] + '"/></td><td><span class="sfDelete deleterow icon-delete"></span></td></tr>';
                                        $('#tblpayment').append(tr);
                                    }
                                }
                                else {
                                    var tr = '<tr><td><input type="text" class="SettingKey" value=" " /></td><td><input type="text" class="SettingValue"  value=" "/></td><td><span class="sfDelete deleterow icon-delete"></span></td></tr>';
                                    $('#tblpayment').append(tr);
                                }
                            }
                        }
                        PaymentGateway.BindDeleteSettingRow();
                    },
                    error: function (msg) { PaymentGateway.ajaxFailure(); }
                });
            },
            ajaxSuccess: function (data) {
                switch (PaymentGateway.config.ajaxCallMode) {
                    case 0:
                        PaymentGateway.BindPaymentGateWays(data.d);
                        break;
                    case 1:
                        SageFrame.messaging.show("Deleted successfully", "success");
                        PaymentGateway.LoadPaymentgateays();
                        break;
                }
            },
            BindPaymentGateWays: function (data) {
                PaymentGateway.ClearGatewayTable();
                if (data != null && data.PaymentID > 0) {
                    PaymentGateway.Hide(6);
                    var datas = jQuery.parseJSON(data.SettingValue);
                    var count = 0;
                    for (var key in datas) {
                        count++;
                        var tr = '<tr><td>' + count + '</td><td> <span class="keyName">' + key + '</span></td><td><span class="paymentSettingEdit icon-edit"></td><td><span class="paymentDelete icon-delete"></td><td><input type="checkbox" class="chkSelect" /></td></tr>';
                        $('.tblPaymentGatewayList').append(tr);
                    }
                    if (count == 0) {
                        PaymentGateway.Hide(1);
                    }
                }
                else {
                    PaymentGateway.Hide(1);
                }
                $('.paymentSettingEdit').on('click', function () {
                    PaymentGateway.Hide(7);
                    var paymentGatewayName = $(this).parents('td').prev().find('.keyName').text();
                    PaymentGateway.EditPaymentGatewaySettings(paymentGatewayName);
                });
                PaymentGateway.DeletePaymentName();
            },

            Hide: function (hide) {
                switch (hide) {
                    case 1://
                        $('.noPaymentName').show();
                        $('.divEdit').hide();
                        $('.CreatePaymentName').hide();
                        $('.PaymentGatewayList').hide();
                        break;
                    case 2:
                        $('.noPaymentName').hide();
                        $('.divEdit').hide();
                        $('.CreatePaymentName').hide();
                        $('.PaymentGatewayList').hide();
                        break;
                    case 3:
                        $('.noPaymentName').hide();
                        $('.divEdit').hide();
                        $('.CreatePaymentName').show();
                        $('#txtPaymentGatewayName').val('');
                        $('.PaymentGatewayList').hide();
                        break;
                    case 4:
                        $('.noPaymentName').hide();
                        $('.divEdit').hide();
                        PaymentGateway.LoadPaymentgateays();
                        $('.PaymentGatewayList').show();
                        break;
                    case 5:
                        $('.noPaymentName').hide();
                        $('.CreatePaymentName').hide();
                        $('.divEdit').show();
                        $('.sfErrormsg').trigger('click');
                        $('.PaymentGatewayList').hide();
                        break;
                    case 6:
                        $('.noPaymentName').hide();
                        $('.divEdit').hide();
                        $('.CreatePaymentName').hide();
                        $('.PaymentGatewayList').show();
                        break;

                    case 7:
                        $('.noPaymentName').hide();
                        $('.CreatePaymentName').hide();
                        $('.divEdit').show();
                        $('.sfErrormsg').trigger('click');
                        $('.PaymentGatewayList').hide();
                        break;

                    case 8:
                        $('.noPaymentName').hide();
                        $('.divEdit').hide();
                        PaymentGateway.LoadPaymentgateays();
                        $('.PaymentGatewayList').show();
                        break;
                }

            },
            ajaxCall: function (config) {
                $.ajax({
                    type: PaymentGateway.config.type,
                    contentType: PaymentGateway.config.contentType,
                    cache: PaymentGateway.config.cache,
                    async: PaymentGateway.config.async,
                    url: PaymentGateway.config.url,
                    data: PaymentGateway.config.data,
                    dataType: PaymentGateway.config.dataType,
                    success: PaymentGateway.ajaxSuccess,
                    error: PaymentGateway.ajaxFailure
                });
            },
        }
        PaymentGateway.init();
    }
    $.fn.PaymentGateway = function (p) {
        $.PaymentGateway(p);
    };
})(jQuery);