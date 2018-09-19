"use strict";

angular.module("managerApp")
    .config(function ($stateProvider) {
        $stateProvider
            .state("iaas.pci-project.compute.openstack.users", {
                url: "/users",
                sticky: true,
                views: {
                    cloudProjectOpenstack: {
                        templateUrl: "app/cloud/project/openstack/users/openstack-users.html",
                        controller: "CloudProjectOpenstackUsersCtrl",
                        controllerAs: "CloudProjectOpenstackUsersCtrl"
                    }
                },
                translations: [
                    "cloud/project/openstack/users",
                    "cloud/project/openstack/users/token",
                    "cloud/project/openstack/users/openrc",
                    "cloud/project/openstack/users/rclone"
                ]
            });
    });
