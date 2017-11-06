"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const Project_1 = require("./Project");
let Allocation = class Allocation extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Allocation.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.IsUUID(4),
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Allocation.prototype, "uuid", void 0);
__decorate([
    sequelize_typescript_1.ForeignKey(() => Project_1.default),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Allocation.prototype, "projectId", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Allocation.prototype, "status", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Allocation.prototype, "provider", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Allocation.prototype, "externalId", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Allocation.prototype, "groupUuidRo", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Allocation.prototype, "groupGidRo", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Allocation.prototype, "groupUuidRw", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Allocation.prototype, "groupGidRw", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Boolean)
], Allocation.prototype, "hasHumanData", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Boolean)
], Allocation.prototype, "hasHumanIdentifiableData", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Boolean)
], Allocation.prototype, "hasHpcRequirement", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    __metadata("design:type", Date)
], Allocation.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    __metadata("design:type", Date)
], Allocation.prototype, "updatedAt", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => Project_1.default),
    __metadata("design:type", Project_1.default)
], Allocation.prototype, "project", void 0);
Allocation = __decorate([
    sequelize_typescript_1.Table({
        tableName: "allocations",
    })
], Allocation);
exports.default = Allocation;
//# sourceMappingURL=Allocation.js.map