describe('Customers Search Control', function(){
       let('customerOne', function(){
           return {
               firstName: 'One',
               lastName: 'Aussie',
               phone: '8829323',
               email: 'one@guy.com'
           }
       });

       let('customerTwo', function(){
           return {
               firstName: 'Man',
               lastName: 'Three',
               phone: '4555TY',
               email: 'three@guy.com'
           }
       });

       let('customerThree', function(){
           return {
               firstName: 'Cuss',
               lastName: 'Two',
               phone: '4555TY',
               email: 'two@guy.com'
           }
       });

       let('customerList', function(){
           return [
               this.customerOne, 
               this.customerTwo, 
               this.customerThree
           ];
       });

       let('customersPromise', function(){
           var deferred = $q.defer();
           deferred.resolve(this.customerList);
           return deferred.promise;
       });

       var self, 
           scope, 
           $customerList;

       beforeEach(function(){
           self = this;
           scope = $rootScope.$new();

           this.sinon.stub($injector.get('coachSeekAPIService'), 'query', function(param){
               return {$promise: self.customersPromise};
           });

           createViewWithController(scope, 'customers/partials/customersView.html', 'customersCtrl');
           $customerList = $testRegion.find('.customer-list');
       });
       describe('when customer list has been loaded', function(){
        // it('should NOT filter by lastName');
        // it('should filter by search box');
        // it('should orderBy firstName then lastName');
          it('should show all the customers', function(){
              expect(scope.$$childHead.customerList).to.eql(this.customerList);
          });
       });
       describe('when picking a letter to sort by', function(){
           beforeEach(function(){
               var $letterA = $customerList.find('.letter-search span').first();
               $letterA.trigger('click');
           });
           it('should set the searchLetter to `A`', function(){
               expect(scope.$$childHead.searchLetter).to.equal('A');
           });
           it('should set the filterHighlight to `A`', function(){
               expect(scope.$$childHead.filterHighlight).to.equal('A');
           });
           it('should show all the customers with last name that starts with A', function(){
               expect(scope.$$childHead.customerList).to.eql([this.customerOne]);
           });
           // it('should filter by lastName');
           // it('should filter by search box');
           // it('should orderBy firstName then lastName');
           describe('and then typing into the searchBox', function(){
               beforeEach(function(){
                   var $searchBox = $customerList.find('.search-container input');
                   $searchBox.val('one').trigger('input');
               });
               it('should set the searchText to `one`', function(){
                   expect(scope.$$childHead.searchText).to.equal('one');
               });
               it('should set the searchLetter to `A`', function(){
                   expect(scope.$$childHead.searchLetter).to.equal('A');
               });
               it('should set the filterHighlight to `one A`', function(){
                   expect(scope.$$childHead.filterHighlight).to.equal('one A');
               });
               it('should show all the customers with last name that starts with A', function(){
                   expect(scope.$$childHead.customerList).to.eql([this.customerOne]);
               });
               // it('should filter by lastName');
               // it('should filter by search box');
               // it('should orderBy firstName then lastName');
           });
           describe('and then sorting by `ALL`', function(){
               beforeEach(function(){
                   var $sortByAll = $customerList.find('.letter-search span').last();
                   $sortByAll.trigger('click');
               });
               it('should set the searchLetter to null', function(){
                   expect(scope.$$childHead.searchLetter).to.equal(null);
               });
               it('should set the filterHighlight to undefined', function(){
                   expect(scope.$$childHead.filterHighlight).to.equal(undefined);
               });
               it('should show all the customers', function(){
                   expect(scope.$$childHead.customerList).to.eql(this.customerList);
               });
               // it('should filter by lastName');
               // it('should filter by search box');
               // it('should orderBy firstName then lastName');
           });
       });
    describe('when typing SS into the search box', function(){
        beforeEach(function(){
            var $searchBox = $customerList.find('.search-container input');
            $searchBox.val('ss').trigger('input');
        });
        it('should set the searchText to `ss`', function(){
            expect(scope.$$childHead.searchText).to.equal('ss');
        });
        it('should show all the customers with last name that contain `ss`', function(){
            expect(scope.$$childHead.customerList).to.eql([this.customerOne, this.customerThree]);
        });
        // it('should NOT filter by lastName');
        // it('should filter by search box');
        // it('should orderBy firstName then lastName');
        describe('when picking a letter to sort by', function(){
            beforeEach(function(){
                var $letterA = $customerList.find('.letter-search span').first();
                $letterA.trigger('click');
            });
            it('should set the searchText to `ss`', function(){
                expect(scope.$$childHead.searchText).to.equal('ss');
            });
            it('should set the searchLetter to `A`', function(){
                expect(scope.$$childHead.searchLetter).to.equal('A');
            });
            it('should set the filterHighlight to `ss A`', function(){
                expect(scope.$$childHead.filterHighlight).to.equal('ss A');
            });
            it('should show all the customers with last name that starts with A and contain `ss`', function(){
                expect(scope.$$childHead.customerList).to.eql([this.customerOne]);
            });
            // it('should filter by lastName');
            // it('should filter by search box');
            // it('should orderBy firstName then lastName');
        });
        describe('and then erasing the searchBox text', function(){
            beforeEach(function(){
                var $searchBox = $customerList.find('.search-container input');
                $searchBox.val('').trigger('input');
            });
            it('should set the searchText to null', function(){
                expect(scope.$$childHead.searchText).to.equal(null);
            });
            it('should show all the customers', function(){
                expect(scope.$$childHead.customerList).to.eql(this.customerList);
            });

            // it('should NOT filter by lastName');
            // it('should filter by search box');
            // it('should orderBy firstName then lastName');
        });
    });
});