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
const Allocation_1 = require("./Allocation");
const ApiUser_1 = require("./ApiUser");
let Project = class Project extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Project.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.IsUUID(4),
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Project.prototype, "uuid", void 0);
__decorate([
    sequelize_typescript_1.ForeignKey(() => ApiUser_1.default),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Project.prototype, "apiUserId", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Project.prototype, "shortCode", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Boolean)
], Project.prototype, "hasHumanData", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Boolean)
], Project.prototype, "hasHumanIdentifiableData", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Boolean)
], Project.prototype, "hasHpcRequirement", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Project.prototype, "notificationUrl", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    __metadata("design:type", Date)
], Project.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    __metadata("design:type", Date)
], Project.prototype, "updatedAt", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => ApiUser_1.default),
    __metadata("design:type", ApiUser_1.default)
], Project.prototype, "apiUser", void 0);
__decorate([
    sequelize_typescript_1.HasMany(() => Allocation_1.default),
    __metadata("design:type", Array)
], Project.prototype, "allocations", void 0);
Project = __decorate([
    sequelize_typescript_1.Table({
        tableName: "projects",
    })
], Project);
exports.default = Project;
//# sourceMappingURL=Project.js.map