describe('Onboarding Defaults Modal', function(){
	let('defaultAttributes', function(){
		return {
			currentUser: {
				firstName: "Boob",
				lastName: "Guy"
			}
		};
	});

	let('promise', function(){
	   var deferred = $q.defer();
	   deferred.resolve();
	   return deferred.promise;
	});

	var saveStub;
	beforeEach(function(){
		modalStub.restore();
		_.assign($rootScope, this.defaultAttributes);
		$injector.get('sessionService').business = {domain : "boobguy"};
		saveStub = this.sinon.stub($injector.get('coachSeekAPIService'), 'save', function(){
		    return {$promise: self.promise};
		});

	    createViewWithController($rootScope, 'index.html', 'appCtrl');
		$injector.get('onboardingModal').open('onboardingDefaultsModal', 'onboardingDefaultsModalCtrl');
		$timeout.flush();
	    $defaultsModal = $('.modal');
	});
	it('should pre load the users first and last name into the form', function(){
		expect($defaultsModal.find('input[name=coachFirstName]').val()).to.equal($rootScope.currentUser.firstName);
		expect($defaultsModal.find('input[name=coachLastName]').val()).to.equal($rootScope.currentUser.lastName);
	});

	describe('when the attempting to create defaults', function(){
		beforeEach(function(){
			$defaultsModal.find('.save-button').trigger('click');
		});
		describe('and the form is valid', function(){
			let('defaultAttributes', function(){
				return {
					locationName: "Arroyo Grande",
					serviceName: "JUST DO IT",
					currentUser: {
						firstName: "Boob",
						lastName: "Guy"
					}
				};
			});

			it('should attempt to save the defaults', function(){
				var coachValues = angular.copy($injector.get('coachDefaults'));
				_.assign(coachValues, {
				    firstName: this.defaultAttributes.currentUser.firstName,
				    lastName: this.defaultAttributes.currentUser.lastName,
				    email: this.defaultAttributes.currentUser.firstName + this.defaultAttributes.currentUser.lastName + "@" + $injector.get('sessionService').business.domain + '.com',
				    phone: i18n.t('onboarding:1800coach') + this.defaultAttributes.currentUser.lastName.toUpperCase()
				});

				var serviceValues = angular.copy($injector.get('serviceDefaults'));
				_.assign(serviceValues, {name: $rootScope.serviceName});

				expect(saveStub).to.be.calledWith({ section: 'Coaches' }, coachValues);
				expect(saveStub).to.be.calledWith({ section: 'Locations' }, {name: $rootScope.locationName});
				expect(saveStub).to.be.calledWith({ section: 'Services' }, serviceValues);
			});
			describe('and the API call is successful', function(){
				it('should remove the login modal', function(){
                    //this must be here in order to flush out ngAnimate
					$injector.get("$$rAF").flush();
					$timeout.flush();
				    expect($('body').hasClass('modal-open')).to.be.false;
				});
			});
		});
		describe('and the form in invalid', function(){
			let('defaultAttributes', function(){
				return {
					// locationName: "Arroyo Grande",
					// serviceName: "JUST DO IT",
					currentUser: {
						firstName: "Boob",
						lastName: "Guy"
					}
				};
			});
			it('should set class on invalid form inputs', function(){
				expect($defaultsModal.find('input[name=serviceName]').hasClass('ng-invalid')).to.be.true;
				expect($defaultsModal.find('input[name=locationName]').hasClass('ng-invalid')).to.be.true;
			});
		});
	});
	describe('when dismissing the modal', function(){
		beforeEach(function(){
			$defaultsModal.find('.close').trigger('click');
		});
		it('should remove the login modal', function(){
            //this must be here in order to flush out ngAnimate
			$injector.get("$$rAF").flush();
			$timeout.flush();
		    expect($('body').hasClass('modal-open')).to.be.false;
		});
	});
});