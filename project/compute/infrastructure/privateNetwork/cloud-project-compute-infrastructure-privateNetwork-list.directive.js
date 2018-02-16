class PrivateNetworkListCtrl {
    constructor ($window, $rootScope, $translate, $stateParams, $state, $q, $uibModal, CloudProjectComputeInfrastructurePrivateNetworkService,
                 OvhApiCloudProjectNetworkPrivate, OvhApiCloudProject, REDIRECT_URLS, CloudMessage, OvhApiMe, URLS, OvhApiVrack, VrackSectionSidebarService, ControllerHelper) {
        this.resources = {
            privateNetwork: OvhApiCloudProjectNetworkPrivate.Lexi(),
            project: OvhApiCloudProject.Lexi(),
            aapi: OvhApiVrack.Aapi(),
            modal: $uibModal
        };
        this.CloudMessage = CloudMessage;
        this.$translate = $translate;
        this.serviceName = null;
        this.service = CloudProjectComputeInfrastructurePrivateNetworkService;
        this.$rootScope = $rootScope;
        this.$q = $q;
        this.$state = $state;
        this.$stateParams = $stateParams;
        this.User = OvhApiMe;
        this.URLS = URLS;
        this.ControllerHelper = ControllerHelper;

        this.loaders = {
            privateNetworks: {
                query: false,
                delete: false,
                activate: false
            },
            vrack: {
                get: false
            },
            vracks: {
                get: true
            }
        };
        this.urls = {
            vrack: REDIRECT_URLS.vRack
        };
        this.models = {
            vrack: null
        };
        this.collections = {
            privateNetworks: []
        };
        this.states = {
            dialog: {
                visible: false
            }
        };
        this.$window = $window;
        // get vRacks for current user, shown in left side bar
        this.vRacks = [];
        VrackSectionSidebarService.getVracks()
            .then(vRacks => {
                this.vRacks = vRacks;
            }).finally(() => {
                this.loaders.vracks.get = false;
            });
    }

    $onInit () {
        this.resources.privateNetwork.resetAllCache();
        if (angular.isUndefined(this.$stateParams.projectId)) {
            this.CloudMessage.error(this.$translate.instant("cpci_private_network_list_context_error"));
        } else {
            this.serviceName = this.$stateParams.projectId;
        }

        this.$rootScope.$on("private-network-dialog:hide", this.hideDialog.bind(this));
        this.$rootScope.$on("private-networks:create", this.createPrivateNetworks.bind(this));

        // Loading privateNetwork first because vrack can fallback to privateNetworkList to find it's ID.
        this.fetchPrivateNetworks().then(() => this.fetchVrack());

        this.User.Lexi().get().$promise.then(user => {
            this.orderUrl = _.get(this.URLS.website_order, `vrack.${user.ovhSubsidiary}`);
        });
    }

    fetchVrack () {
        if (this.loaders.vrack.get) {
            return;
        }
        this.loaders.vrack.get = true;

        return this.resources.project.vrack({ serviceName: this.serviceName }).$promise
            .then(vrack => this.models.vrack = vrack)
            .then(() => this.getVrackId())
            .then(id => this.models.vrack.id = id)
            .catch(() => this.models.vrack = null)
            .finally(() => this.loaders.vrack.get = false);
    }


    /**
     * open UI activate private network modal if there are pre ordered vRacks else
     * take user to order new vRack page
     *
     * @memberof PrivateNetworkListCtrl
     */
    addVRack () {
        const vRacks = this.vRacks;
        if (vRacks.length > 0) {
            // user has pre ordered vRacks
            const orderUrl = this.orderUrl;

            this.ControllerHelper.modal.showModal({
                modalConfig: {
                    templateUrl: "app/cloud/project/compute/infrastructure/privateNetwork/addVRack/cloud-project-compute-infrastructure-privateNetwork-addVRack.html",
                    controller: "AddVRackCtrl",
                    controllerAs: "$ctrl",
                    resolve: {
                        params: () => ({
                            orderUrl,
                            vRacks
                        })
                    }
                }
            }).then(vRack => {
                // closed or resolved
                if (vRack) {
                    this.models.vrack = vRack;
                }
            }, () => {
                // dismissed, show error message on UI
                this.CloudMessage.error(this.$translate.instant("cpci_private_network_add_vrack_error"));
            });
        } else {
            // user has no vRacks, take him to order new vRack page
            this.$window.open(this.orderUrl, "_blank");
        }
    }

    deletePrivateNetwork (privateNetwork) {
        const modal = this.resources.modal.open({
            windowTopClass: "cui-modal",
            templateUrl: "app/cloud/project/compute/infrastructure/privateNetwork/delete/cloud-project-compute-infrastructure-privateNetwork-delete.html",
            controller: "CloudprojectcomputeinfrastructureprivatenetworkdeleteCtrl",
            controllerAs: "CloudprojectcomputeinfrastructureprivatenetworkdeleteCtrl",
            resolve: {
                params: () => privateNetwork
            }
        });
        modal.result
            .then(() => this.loaders.privateNetworks.delete = true)
            .finally(() => {
                this.loaders.privateNetworks.delete = false;
                this.deletePrivateNetworkFromList(privateNetwork);
            }
        );
    }

    deletePrivateNetworkFromList (privateNetwork) {
        const newPrivateNetworks = this.collections.privateNetworks.filter(el => el.id !== privateNetwork);
        this.collections.privateNetworks = newPrivateNetworks;
        return this.collections;
    }

    createPrivateNetworks (event, args) {
        this.hideDialog();
        const subnets =  _.chain(args.subnets)
                        .values()
                        .filter(subnet => _.contains(args.privateNetwork.regions, subnet.region))
                        .map(subnet => _.assign(subnet, { dhcp: args.isDHCPEnabled, network: args.globalNetwork }))
                        .value();

        const onNetworkCreated = function (network) {
            const promises = _.map(subnets, subnet => this.service.saveSubnet(args.projectId, network.id, subnet).$promise, this);
            return this.$q.all(promises).then(() => this.fetchPrivateNetworks());
        }.bind(this);

        this.service.savePrivateNetwork(args.projectId, args.privateNetwork, onNetworkCreated);
    }

    fetchPrivateNetworks () {
        if (this.loaders.privateNetworks.query) {
            return this.$q.when(null);
        }
        this.loaders.privateNetworks.query = true;

        return this.resources.privateNetwork.query({
            serviceName: this.serviceName
        }).$promise
            .then(networks => {
                this.collections.privateNetworks = networks;
                _.forEach(this.collections.privateNetworks, network => {
                    if (network.id) {
                        network.shortVlanId = _.last(network.id.split("_"));
                    }
                });
            }).catch(() => {
                this.collections.privateNetworks = [];
                this.CloudMessage.error(this.$translate.instant("cpci_private_network_list_private_network_query_error"));
            }).finally(() => this.loaders.privateNetworks.query = false);
    }

    getPrivateNetworks () {
        return _.sortBy(this.collections.privateNetworks, "vlanId");
    }

    getVrackName () {
        if (_.has(this.models.vrack, "name") && !_.isEmpty(this.models.vrack.name)) {
            return this.models.vrack.name;
        } else if (_.has(this.models.vrack, "id") && !_.isEmpty(this.models.vrack.id)) {
            return this.models.vrack.id;
        } else {
            return this.$translate.instant("cpci_private_network_list_vrack_unnamed");
        }
    }

    getVrackId () {
        if (_.has(this.models.vrack, "id") && !_.isEmpty(this.models.vrack.id)) {
            return this.$q.when(this.models.vrack.id);
        } else {
            if (_.isEmpty(this.models.vrack.name)) {
                return this.fetchPrivateNetworks()
                    .then(() => {
                        if (_.any(this.collections.privateNetworks)) {
                            return _.first(_.first(this.collections.privateNetworks).id.split("_"));
                        } else {
                            return this.$q.when(null);
                        }
                    });

            } else {
                return this.resources.aapi.query().$promise
                    .then(vracks => {
                        const vrack = _.find(vracks, { name: this.models.vrack.name });
                        return _.get(vrack, "id", null);
                    })
                    .catch(() => null);
            }
        }
    }

    gotoVrack () {
        this.getVrackId().then(id => this.$state.go("vrack", { vrackId : id }));
    }

    canGotoVrack () {
        return this.hasVrack() && !_.isNull(this.models.vrack.id);
    }

    hasVrack () {
        return this.loaders.vrack.get === false && !_.isNull(this.models.vrack);
    }

    showDialog () {
        this.states.dialog.visible = true;
    }

    hideDialog () {
        this.states.dialog.visible = false;
        this.$rootScope.$broadcast("highlighed-element.hide", "compute");
    }

    toggleDialog () {
        this.states.dialog.visible = !this.states.dialog.visible;
    }

    hasVisibleDialog () {
        return this.states.dialog.visible;
    }

    hasPendingLoaders () {
        return _.some(this.loaders, "query", true) ||
               _.some(this.loaders, "get", true)   ||
               this.isVrackCreating();
    }

    isVrackCreating () {
        return this.service.isSavePending();
    }

    onKeyDown ($event) {
        switch ($event.which) {
            case 27:
                //Important not to put $event.preventDefault(); before the switch statement since it will catch and prevent default
                //behavior on keyDown everywhere in the directive, inputs included.
                $event.preventDefault();
                this.hideDialog();
                break;
        }
    }
}

angular.module("managerApp")
    .directive("privateNetworkList", () => ({
        restrict: "E",
        templateUrl: "app/cloud/project/compute/infrastructure/privateNetwork/cloud-project-compute-infrastructure-privateNetwork-list.html",
        controller: PrivateNetworkListCtrl,
        controllerAs: "$ctrl",
        bindToController: true,
        replace: false
    }));
