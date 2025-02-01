-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema helisys
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema helisys
-- -----------------------------------------------------
-- Crear el esquema si no existe
CREATE SCHEMA IF NOT EXISTS `helisys`
    DEFAULT CHARACTER SET utf16
    COLLATE utf16_spanish_ci;

-- Seleccionar el esquema
USE `helisys`;

-- Crear el usuario (en este ejemplo, se asume conexión desde localhost)
CREATE USER IF NOT EXISTS 'helisys'@'localhost' IDENTIFIED BY 'MyC0mpl3xP@ss2025';

-- Otorgar todos los privilegios sobre el esquema al usuario creado
GRANT ALL PRIVILEGES ON `helisys`.* TO 'helisys'@'localhost';

-- Aplicar los cambios de privilegios
FLUSH PRIVILEGES;


-- -----------------------------------------------------
-- Table `helisys`.`modelo_aeronave`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `helisys`.`modelo_aeronave` (
  `mre_id` INT(11) NOT NULL,
  `mre_nombre` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`mre_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf16
COLLATE = utf16_spanish_ci;


-- -----------------------------------------------------
-- Table `helisys`.`aeronave`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `helisys`.`aeronave` (
  `anv_id` INT(11) NOT NULL AUTO_INCREMENT,
  `anv_mre_id` INT(11) NOT NULL,
  `anv_matricula` VARCHAR(45) NOT NULL,
  `anv_numero_serie` VARCHAR(45) NOT NULL,
  `anv_fabricacion` VARCHAR(25) NOT NULL,
  PRIMARY KEY (`anv_id`, `anv_mre_id`),
  UNIQUE INDEX `anv_matricula_UNIQUE` (`anv_matricula` ASC) VISIBLE,
  INDEX `fk_aeronave_modelo_aeronave1_idx` (`anv_mre_id` ASC) VISIBLE,
  CONSTRAINT `fk_aeronave_modelo_aeronave1`
    FOREIGN KEY (`anv_mre_id`)
    REFERENCES `helisys`.`modelo_aeronave` (`mre_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 8
DEFAULT CHARACTER SET = utf16
COLLATE = utf16_spanish_ci;


-- -----------------------------------------------------
-- Table `helisys`.`almacen_estante`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `helisys`.`almacen_estante` (
  `amt_id` INT(11) NOT NULL AUTO_INCREMENT,
  `amt_descripcion` VARCHAR(25) NOT NULL,
  PRIMARY KEY (`amt_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 10
DEFAULT CHARACTER SET = utf16
COLLATE = utf16_spanish_ci;


-- -----------------------------------------------------
-- Table `helisys`.`almacen_repisa`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `helisys`.`almacen_repisa` (
  `amr_id` INT(11) NOT NULL AUTO_INCREMENT,
  `amr_amt_id` INT(11) NOT NULL,
  `amr_nombre` VARCHAR(25) NOT NULL,
  PRIMARY KEY (`amr_id`, `amr_amt_id`),
  INDEX `FK6psftgtbvh91ydenx8jq2cv8p` (`amr_amt_id` ASC) VISIBLE,
  CONSTRAINT `FK6psftgtbvh91ydenx8jq2cv8p`
    FOREIGN KEY (`amr_amt_id`)
    REFERENCES `helisys`.`almacen_estante` (`amt_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 41
DEFAULT CHARACTER SET = utf16
COLLATE = utf16_spanish_ci;


-- -----------------------------------------------------
-- Table `helisys`.`almacen_contenedor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `helisys`.`almacen_contenedor` (
  `amc_id` INT(11) NOT NULL AUTO_INCREMENT,
  `amc_amr_id` INT(11) NOT NULL,
  `amc_numero` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`amc_id`, `amc_amr_id`),
  INDEX `FK_contenedor_repisa` (`amc_amr_id` ASC) VISIBLE,
  CONSTRAINT `FK_contenedor_repisa`
    FOREIGN KEY (`amc_amr_id`)
    REFERENCES `helisys`.`almacen_repisa` (`amr_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 1212
DEFAULT CHARACTER SET = utf16
COLLATE = utf16_spanish_ci;


-- -----------------------------------------------------
-- Table `helisys`.`brigada`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `helisys`.`brigada` (
  `bga_id` INT(11) NOT NULL AUTO_INCREMENT,
  `bga_nombre` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`bga_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf16
COLLATE = utf16_spanish_ci;


-- -----------------------------------------------------
-- Table `helisys`.`proveedor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `helisys`.`proveedor` (
  `pve_id` INT(11) NOT NULL AUTO_INCREMENT,
  `pve_nombre` VARCHAR(45) NOT NULL,
  `pve_telefono` VARCHAR(45) NOT NULL,
  `pve_fax` VARCHAR(45) NOT NULL,
  `pve_email` VARCHAR(45) NOT NULL,
  `pve_direccion` VARCHAR(60) NOT NULL,
  `pve_ciudad` VARCHAR(45) NOT NULL,
  `pve_pais` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`pve_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 6
DEFAULT CHARACTER SET = utf16
COLLATE = utf16_spanish_ci;


-- -----------------------------------------------------
-- Table `helisys`.`contacto_proveedor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `helisys`.`contacto_proveedor` (
  `cpe_id` INT(11) NOT NULL AUTO_INCREMENT,
  `cpe_pve_id` INT(11) NOT NULL,
  `cpe_nombre` VARCHAR(45) NOT NULL,
  `cpe_telefono` VARCHAR(45) NOT NULL,
  `cpe_email` VARCHAR(45) NOT NULL,
  `cpe_url` VARCHAR(200) NOT NULL,
  PRIMARY KEY (`cpe_id`, `cpe_pve_id`),
  UNIQUE INDEX `cpe_email_UNIQUE` (`cpe_email` ASC) VISIBLE,
  INDEX `FKfepw0xrgom3t8991dxmqxsvbv` (`cpe_pve_id` ASC) VISIBLE,
  CONSTRAINT `FKfepw0xrgom3t8991dxmqxsvbv`
    FOREIGN KEY (`cpe_pve_id`)
    REFERENCES `helisys`.`proveedor` (`pve_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 6
DEFAULT CHARACTER SET = utf16
COLLATE = utf16_spanish_ci;


-- -----------------------------------------------------
-- Table `helisys`.`unidad`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `helisys`.`unidad` (
  `und_id` INT(11) NOT NULL AUTO_INCREMENT,
  `und_bga_id` INT(11) NOT NULL,
  `und_nombre` VARCHAR(45) NOT NULL,
  `und_telefono` VARCHAR(45) NOT NULL,
  `und_fax` VARCHAR(45) NOT NULL,
  `und_comandante_nombre` VARCHAR(45) NOT NULL,
  `und_direccion` VARCHAR(200) NOT NULL,
  `und_departamento` VARCHAR(45) NOT NULL,
  `und_provincia` VARCHAR(45) NOT NULL,
  `und_ciudad` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`und_id`, `und_bga_id`),
  INDEX `FK491ajtaxxgef8yq7sq6sq4moh` (`und_bga_id` ASC) VISIBLE,
  CONSTRAINT `FK491ajtaxxgef8yq7sq6sq4moh`
    FOREIGN KEY (`und_bga_id`)
    REFERENCES `helisys`.`brigada` (`bga_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf16
COLLATE = utf16_spanish_ci;


-- -----------------------------------------------------
-- Table `helisys`.`escuadron`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `helisys`.`escuadron` (
  `edn_id` INT(11) NOT NULL AUTO_INCREMENT,
  `edn_und_id` INT(11) NOT NULL,
  `edn_nombre` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`edn_id`, `edn_und_id`),
  INDEX `FK5j0a5vefskifp6ef7a9ralj2m` (`edn_und_id` ASC) VISIBLE,
  CONSTRAINT `FK5j0a5vefskifp6ef7a9ralj2m`
    FOREIGN KEY (`edn_und_id`)
    REFERENCES `helisys`.`unidad` (`und_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf16
COLLATE = utf16_spanish_ci;


-- -----------------------------------------------------
-- Table `helisys`.`grado`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `helisys`.`grado` (
  `gdo_id` INT(11) NOT NULL AUTO_INCREMENT,
  `gdo_nombre` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`gdo_id`),
  UNIQUE INDEX `gdo_nombre_UNIQUE` (`gdo_nombre` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 31
DEFAULT CHARACTER SET = utf16
COLLATE = utf16_spanish_ci;


-- -----------------------------------------------------
-- Table `helisys`.`pedidos_compra`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `helisys`.`pedidos_compra` (
  `pca_id` INT(11) NOT NULL AUTO_INCREMENT,
  `pca_descripcion` VARCHAR(45) NOT NULL,
  `pca_fecha_pedido` DATE NOT NULL,
  `pca_fecha_envio` DATE NOT NULL,
  `pca_fecha_entrega` DATE NOT NULL,
  `pca_fecha_prometida` DATE NOT NULL,
  `pca_direccion_envio` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`pca_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf16
COLLATE = utf16_spanish_ci;


-- -----------------------------------------------------
-- Table `helisys`.`tipo_producto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `helisys`.`tipo_producto` (
  `tpo_id` INT(11) NOT NULL AUTO_INCREMENT,
  `tpo_nombre_tipo` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`tpo_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf16
COLLATE = utf16_spanish_ci;


-- -----------------------------------------------------
-- Table `helisys`.`producto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `helisys`.`producto` (
  `pro_id` INT(11) NOT NULL AUTO_INCREMENT,
  `pro_numero_parte` VARCHAR(45) NOT NULL,
  `pro_tpo_id` INT(11) NOT NULL,
  `pro_mre_id` INT(11) NOT NULL,
  `pro_pve_id` INT(11) NOT NULL,
  `pro_amc_id` INT(11) NOT NULL,
  `pro_nombre` VARCHAR(45) NOT NULL,
  `pro_numero_parte_alterno` VARCHAR(45) NULL DEFAULT NULL,
  `pro_numero_serie` VARCHAR(45) NOT NULL,
  `pro_unidades` INT(11) NOT NULL,
  `pro_fecha_vencimiento` DATE NULL DEFAULT NULL,
  `pro_tipo_documento` VARCHAR(25) NOT NULL,
  PRIMARY KEY (`pro_id`, `pro_numero_parte`, `pro_tpo_id`, `pro_mre_id`, `pro_pve_id`, `pro_amc_id`),
  INDEX `FK_pro_tpo_id` (`pro_tpo_id` ASC) VISIBLE,
  INDEX `fk_producto_modelo_aeronave1_idx` (`pro_mre_id` ASC) VISIBLE,
  INDEX `fk_producto_proveedor1_idx` (`pro_pve_id` ASC) VISIBLE,
  INDEX `fk_producto_almacen_contenedor1_idx` (`pro_amc_id` ASC) VISIBLE,
  CONSTRAINT `FK_pro_tpo_id`
    FOREIGN KEY (`pro_tpo_id`)
    REFERENCES `helisys`.`tipo_producto` (`tpo_id`),
  CONSTRAINT `fk_producto_almacen_contenedor1`
    FOREIGN KEY (`pro_amc_id`)
    REFERENCES `helisys`.`almacen_contenedor` (`amc_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_producto_modelo_aeronave1`
    FOREIGN KEY (`pro_mre_id`)
    REFERENCES `helisys`.`modelo_aeronave` (`mre_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_producto_proveedor1`
    FOREIGN KEY (`pro_pve_id`)
    REFERENCES `helisys`.`proveedor` (`pve_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 1335
DEFAULT CHARACTER SET = utf16
COLLATE = utf16_spanish_ci;


-- -----------------------------------------------------
-- Table `helisys`.`pedidos_producto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `helisys`.`pedidos_producto` (
  `ppt_id` INT(11) NOT NULL AUTO_INCREMENT,
  `ppt_pca_id` INT(11) NOT NULL,
  `ppt_pro_id` INT(11) NOT NULL,
  `ppt_cantidad` INT(11) NOT NULL,
  `ppt_precio_unitario` INT(11) NOT NULL,
  PRIMARY KEY (`ppt_id`, `ppt_pca_id`, `ppt_pro_id`),
  INDEX `FKrfm7s262hoxc1fdd23eg7j55a` (`ppt_pca_id` ASC) VISIBLE,
  INDEX `FKf5jpfcvr1sc0jvd0w9d3eb7d5` (`ppt_pro_id` ASC) VISIBLE,
  CONSTRAINT `FKf5jpfcvr1sc0jvd0w9d3eb7d5`
    FOREIGN KEY (`ppt_pro_id`)
    REFERENCES `helisys`.`producto` (`pro_id`),
  CONSTRAINT `FKrfm7s262hoxc1fdd23eg7j55a`
    FOREIGN KEY (`ppt_pca_id`)
    REFERENCES `helisys`.`pedidos_compra` (`pca_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf16
COLLATE = utf16_spanish_ci;


-- -----------------------------------------------------
-- Table `helisys`.`transaccion_evento`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `helisys`.`transaccion_evento` (
  `tvo_id` INT(11) NOT NULL AUTO_INCREMENT,
  `tvo_evento` VARCHAR(25) NOT NULL,
  PRIMARY KEY (`tvo_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 10
DEFAULT CHARACTER SET = utf16
COLLATE = utf16_spanish_ci;


-- -----------------------------------------------------
-- Table `helisys`.`usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `helisys`.`usuario` (
  `usr_id` INT(11) NOT NULL AUTO_INCREMENT,
  `usr_gdo_id` INT(11) NOT NULL,
  `usr_edn_id` INT(11) NOT NULL,
  `usr_ct_identidad` INT(11) NOT NULL,
  `usr_ct_militar` INT(11) NOT NULL,
  `usr_nombre` VARCHAR(45) NOT NULL,
  `usr_apellido` VARCHAR(45) NOT NULL,
  `usr_direccion` VARCHAR(225) NOT NULL,
  `usr_telefono` VARCHAR(45) NOT NULL,
  `usr_cargo` VARCHAR(45) NOT NULL,
  `usr_foto` VARCHAR(225) NOT NULL,
  `usr_login` VARCHAR(45) NOT NULL,
  `usr_password` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`usr_id`, `usr_gdo_id`),
  UNIQUE INDEX `usr_user_UNIQUE` (`usr_login` ASC) VISIBLE,
  UNIQUE INDEX `usr_password_UNIQUE` (`usr_password` ASC) VISIBLE,
  UNIQUE INDEX `usr_ct_militar_UNIQUE` (`usr_ct_militar` ASC) VISIBLE,
  UNIQUE INDEX `usr_ct_identidad_UNIQUE` (`usr_ct_identidad` ASC) VISIBLE,
  INDEX `FK7jrv4dw2djnp7tp7mwffpakhq` (`usr_edn_id` ASC) VISIBLE,
  INDEX `FK80k6w5tforcn3xjcx7x3uya1i` (`usr_gdo_id` ASC) VISIBLE,
  CONSTRAINT `FK7jrv4dw2djnp7tp7mwffpakhq`
    FOREIGN KEY (`usr_edn_id`)
    REFERENCES `helisys`.`escuadron` (`edn_id`),
  CONSTRAINT `FK80k6w5tforcn3xjcx7x3uya1i`
    FOREIGN KEY (`usr_gdo_id`)
    REFERENCES `helisys`.`grado` (`gdo_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 11
DEFAULT CHARACTER SET = utf16
COLLATE = utf16_spanish_ci;


-- -----------------------------------------------------
-- Table `helisys`.`transaccion`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `helisys`.`transaccion` (
  `tce_id` INT(11) NOT NULL AUTO_INCREMENT,
  `tce_usr_id` INT(11) NOT NULL,
  `tce_tvo_id` INT(11) NOT NULL,
  `tce_fecha_transaccion` DATE NOT NULL,
  `tce_observaciones` VARCHAR(500) NOT NULL,
  `tce_anv_id` INT(11) NULL DEFAULT NULL,
  PRIMARY KEY (`tce_id`, `tce_usr_id`, `tce_tvo_id`),
  INDEX `FKaqj9wk94c5iylabaijj3dpxti` (`tce_usr_id` ASC) VISIBLE,
  INDEX `FK9sfdxr4f1ewyrufa2x1eukson` (`tce_tvo_id` ASC) VISIBLE,
  INDEX `FK_transaccion_aeronave` (`tce_anv_id` ASC) VISIBLE,
  CONSTRAINT `FK9sfdxr4f1ewyrufa2x1eukson`
    FOREIGN KEY (`tce_tvo_id`)
    REFERENCES `helisys`.`transaccion_evento` (`tvo_id`),
  CONSTRAINT `FK_transaccion_aeronave`
    FOREIGN KEY (`tce_anv_id`)
    REFERENCES `helisys`.`aeronave` (`anv_id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT `FKaqj9wk94c5iylabaijj3dpxti`
    FOREIGN KEY (`tce_usr_id`)
    REFERENCES `helisys`.`usuario` (`usr_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 9452
DEFAULT CHARACTER SET = utf16
COLLATE = utf16_spanish_ci;


-- -----------------------------------------------------
-- Table `helisys`.`transacciones_producto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `helisys`.`transacciones_producto` (
  `tco_id` INT(11) NOT NULL AUTO_INCREMENT,
  `tco_tce_id` INT(11) NOT NULL,
  `tco_pro_id` INT(11) NOT NULL,
  `tco_unidades` INT(11) NOT NULL,
  PRIMARY KEY (`tco_id`, `tco_tce_id`, `tco_pro_id`),
  INDEX `FKl3ewp0bdbndpdxvf7bcnlb91d` (`tco_pro_id` ASC) VISIBLE,
  INDEX `FKls5fwujvxn8ajp26tjwk4m5ay` (`tco_tce_id` ASC) VISIBLE,
  CONSTRAINT `FKl3ewp0bdbndpdxvf7bcnlb91d`
    FOREIGN KEY (`tco_pro_id`)
    REFERENCES `helisys`.`producto` (`pro_id`),
  CONSTRAINT `FKls5fwujvxn8ajp26tjwk4m5ay`
    FOREIGN KEY (`tco_tce_id`)
    REFERENCES `helisys`.`transaccion` (`tce_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 9452
DEFAULT CHARACTER SET = utf16
COLLATE = utf16_spanish_ci;

DROP TRIGGER IF EXISTS `helisys`.`actualizar_unidades_producto`;


USE `helisys`;

DELIMITER $$
USE `helisys`$$
CREATE
DEFINER=``@``
TRIGGER `helisys`.`actualizar_unidades_producto`
AFTER INSERT ON `helisys`.`transacciones_producto`
FOR EACH ROW
BEGIN
    DECLARE tipo_evento INT;

    -- Obtener el tipo de evento (alta o baja) desde la tabla transaccion
    SELECT tce_tvo_id
    INTO tipo_evento
    FROM transaccion
    WHERE tce_id = NEW.tco_tce_id;

    -- Verificar si es un evento de alta (1, 2, 3)
    IF tipo_evento IN (1, 2, 3) THEN
        UPDATE producto
        SET pro_unidades = pro_unidades + NEW.tco_unidades
        WHERE pro_id = NEW.tco_pro_id;

    -- Verificar si es un evento de baja (4, 5, 6, 7, 8)
    ELSEIF tipo_evento IN (4, 5, 6, 7, 8) THEN
        UPDATE producto
        SET pro_unidades = pro_unidades - NEW.tco_unidades
        WHERE pro_id = NEW.tco_pro_id;

    END IF;
END$$


DELIMITER ;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
