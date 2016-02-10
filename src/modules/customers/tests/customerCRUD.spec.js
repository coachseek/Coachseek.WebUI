describe('Customers CRUD Control', function(){
    describe('when loading the customer list', function(){
        let('customerOne', function(){
            return {
                id: '01',
                firstName: 'One',
                lastName: 'Cuss',
                phone: '8829323',
                email: 'one@guy.com',
                dateOfBirth: '1959-02-06',
                customFields: this.customFields
            }
        });

        let('customerTwo', function(){
            return {
                id: '02',
                firstName: 'Cuss',
                lastName: 'Two',
                phone: '4555TY',
                email: 'two@guy.com',
                dateOfBirth: '1959-02-06'
            }
        });

        let('customerList', function(){
            return [this.customerOne, {id: '03'}, {id: '04'},{id: '05'},{id: '06'}];
        });

        let('customersPromise', function(){
            var deferred = $q.defer();
            deferred.resolve(this.customerList);
            return deferred.promise;
        });

        let('customFields', function(){
            return [
                {key: 'noteone', value: 'boobs'},
                {key: 'notetwo', value: 'moreboobs'}
            ];
        });

        let('customerNotes', function(){
            return [{
                key: 'noteone',
                isRequired: true
            },{
                key: 'notetwo',
                isRequired: false
            }]
        });

        let('customFieldsPromise', function(){
            var deferred = $q.defer();
            deferred.resolve(this.customerNotes);
            return deferred.promise;
        });

        let('savepromise', function(){
            var deferred = $q.defer();
            deferred.resolve(this.customerOne);
            return deferred.promise;
        });

        let('ModernizrTouchevents', function(){
            return Modernizr.touchevents;
        })

        var self, getStub, coachSeekAPIService, scope, $customerListView, $customerItemView;
        beforeEach(function(){
            self = this;
            Modernizr.touchevents = this.ModernizrTouchevents;

            coachSeekAPIService = $injector.get('coachSeekAPIService');
            scope = $rootScope.$new();

            getStub = this.sinon.stub(coachSeekAPIService, 'query', function(param){
                if(param.section === 'Customers'){
                    return {$promise: self.customersPromise};
                } else if (param.section === 'CustomFields') {
                    return {$promise: self.customFieldsPromise};
                }
            });
            createViewWithController(scope, 'customers/partials/customersView.html', 'customersCtrl');
            $customerListView = $testRegion.find('.customers-list-view');
            $customerItemView = $testRegion.find('.customers-item-view');
        });
        it('should attempt to get existing customers', function(){
            expect(getStub).to.be.calledWith({section: 'Customers'})
        });
        it('should attempt to get business` custom fields', function(){
            expect(getStub).to.be.calledWith({section: 'CustomFields', type: 'customer'})
        });
        it('should show the export-to-csv button', function(){
            expect($testRegion.find('export-to-csv').length).to.equal(1);
        });
        it('should add the custom files to the export keys', function(){
            _.each(this.customFields, function(customField){
                expect(_.includes(_.last(scope.exportKeys).customFields, customField.key)).to.be.true;            
            });
        });
        describe('and the device is a touch device', function(){
            let('ModernizrTouchevents', function(){
                return true;
            })
            it('should NOT show the export-to-csv button', function(){
                expect($testRegion.find('export-to-csv').length).to.equal(0);
            });
        })
        describe('during loading', function(){
            
            let('customersPromise', function(){
                return $q.defer().promise;
            });

            it('should disable the create item button while loading', function(){
                expect($customerListView.find('.create-item').attr('disabled')).to.equal('disabled');
            });
        });
        describe('and there is one or more customers', function(){
            it('should show the customer list view', function(){
                expect($customerListView.hasClass('ng-hide')).to.be.false;
            });
            it('should have as many list entries as customer', function(){
                expect($customerListView.find('.customer-details').length).to.equal(self.customerList.length)
            })
            it('should not show the customer item view', function(){
                expect($customerItemView.hasClass('ng-hide')).to.be.true;
            });


            describe('when clicking the edit button', function(){
                beforeEach(function(){
                    $customerListView.find('.edit-item').first().trigger('click');
                });
                it('should not show the customer list view', function(){
                    expect($customerListView.hasClass('ng-hide')).to.be.true;
                });
                it('should show the customer item view', function(){
                    expect($customerItemView.hasClass('ng-hide')).to.be.false;
                });
                it('should show the cancel button', function(){
                    expect($customerItemView.find('.cancel-button').hasClass('ng-hide')).to.be.false;
                });

                describe('when changing values to an empty string', function(){
                    it('should set email value to undefined', function(){
                        scope.item.email = '';
                        scope.$apply();

                        expect(scope.item.email).to.equal(undefined);
                    });
                    it('should set phone value to undefined', function(){
                        scope.item.phone = '';
                        scope.$apply();

                        expect(scope.item.phone).to.equal(undefined);
                    });
                });

                describe('when clicking the save button', function(){
                    
                    var saveStub;
                    beforeEach(function(){
                        self.savepromise = this.savepromise;

                        saveStub = this.sinon.stub(coachSeekAPIService, 'save', function(){
                            return {$promise: self.savepromise};
                        });
                    });

                    describe('when there are custom fields', function(){
                        beforeEach(function(){
                            $customerItemView.find('.save-button').trigger('click');
                        });
                        it('should attempt to save the customer', function(){
                            expect(saveStub).to.be.calledWith({section: 'Customers'}, this.customerOne);
                        });
                        it('should then attempt to save the custom fields', function(){
                            expect(saveStub).to.be.calledWith({section: 'Customers', id: this.customerOne.id}, {customFields: this.customerOne.customFields}); 
                        });
                    });

                    describe('when there are NO custom fields', function(){
                        let('customFields', function(){
                            return [];
                        });
                        beforeEach(function(){
                            $customerItemView.find('.save-button').trigger('click');
                        });
                        it('should attempt to save the customer', function(){
                            expect(saveStub).to.be.calledWith({section: 'Customers'}, this.customerOne);
                        });
                        it('should NOT attempt to save the custom fields', function(){
                            expect(saveStub).to.be.calledOnce;
                        });
                    });


                    describe('during save', function(){

                        let('savepromise', function(){
                            return $q.defer().promise;
                        });

                        beforeEach(function(){
                            $customerItemView.find('.save-button').trigger('click');
                        });

                        it('should disable the save item button while loading', function(){
                            expect($customerItemView.find('.save-button').attr('disabled')).to.equal('disabled');
                        });
                        it('should show `saving...` on the save button', function(){
                            var saveButtonText = $customerItemView.find('.save-button .save-text').text();
                            expect(saveButtonText).to.equal(i18n.t('saving'));
                        }
                        );
                    });

                    describe('when the form is invalid', function(){
                        describe('when the firstName is invalid', function(){
                            it('should display an invalid input alert', function(){
                                scope.item.firstName = null;
                                scope.$apply();
                                $customerItemView.find('.save-button').trigger('click');

                                expect($rootScope.alerts[0].type).to.equal('warning');
                                expect($rootScope.alerts[0].message).to.equal('businessSetup:firstName-invalid');
                            });
                        });
                        describe('when the firstName is invalid', function(){
                            it('should display an invalid input alert', function(){
                                scope.item.lastName = null;
                                scope.$apply();
                                $customerItemView.find('.save-button').trigger('click');

                                expect($rootScope.alerts[0].type).to.equal('warning');
                                expect($rootScope.alerts[0].message).to.equal('businessSetup:lastName-invalid');
                            });
                        });
                    });
                });
                describe('when clicking the cancel button', function(){
                    beforeEach(function(){
                        scope.item = {
                                firstName: "dumbnew",
                                lastName: "userguy"
                        }
                        scope.$digest();

                        $rootScope.alerts.push({type: 'warning', message: 'test alert'});

                        $customerItemView.find('.cancel-button').trigger('click');
                    });
                    it('should reset all edits made', function(){
                        var unsavedcustomer = scope.itemList.pop();

                        expect(unsavedcustomer.name).to.equal(this.customerOne.name);
                        expect(unsavedcustomer.description).to.equal(this.customerOne.description);
                    });
                    it('should remove alert if present', function(){
                        expect($rootScope.alerts.length).to.equal(0);
                    });
                });
            });
            describe('when creating a new customer', function(){
                var initCustomerListLength;
                beforeEach(function(){
                    initCustomerListLength = scope.itemList.length;

                    $customerListView.find('.create-item').trigger('click');
                });
                it('should set the list item to default value', function(){
                    expect(scope.item).to.eql({});
                });
                it('should not show the customer list view', function(){
                    expect($customerListView.hasClass('ng-hide')).to.be.true;
                });
                it('should show the customer item view', function(){
                    expect($customerItemView.hasClass('ng-hide')).to.be.false;
                });
                it('should show the cancel button', function(){
                    expect($customerItemView.find('.cancel-button').hasClass('ng-hide')).to.be.false;
                });
                it('should set the newItem flag to true', function(){
                    expect(scope.newItem).to.be.true;
                });
                describe('when clicking the cancel button and customer is new', function(){
                    beforeEach(function(){
                        $customerItemView.find('.cancel-button').trigger('click');
                    });
                    it('should discard the new customer', function(){
                        expect(scope.itemList.length).to.equal(initCustomerListLength);
                    });
                })
            });
        });
    });
});