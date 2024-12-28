package io.bootify.helisys.model;

import static java.lang.annotation.ElementType.ANNOTATION_TYPE;
import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.ElementType.METHOD;

import io.bootify.helisys.service.UsuarioService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Constraint;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import jakarta.validation.Payload;
import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import java.util.Map;
import org.springframework.web.servlet.HandlerMapping;


/**
 * Validate that the usrCtMilitar value isn't taken yet.
 */
@Target({ FIELD, METHOD, ANNOTATION_TYPE })
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Constraint(
        validatedBy = UsuarioUsrCtMilitarUnique.UsuarioUsrCtMilitarUniqueValidator.class
)
public @interface UsuarioUsrCtMilitarUnique {

    String message() default "{Exists.usuario.usrCtMilitar}";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

    class UsuarioUsrCtMilitarUniqueValidator implements ConstraintValidator<UsuarioUsrCtMilitarUnique, Integer> {

        private final UsuarioService usuarioService;
        private final HttpServletRequest request;

        public UsuarioUsrCtMilitarUniqueValidator(final UsuarioService usuarioService,
                final HttpServletRequest request) {
            this.usuarioService = usuarioService;
            this.request = request;
        }

        @Override
        public boolean isValid(final Integer value, final ConstraintValidatorContext cvContext) {
            if (value == null) {
                // no value present
                return true;
            }
            @SuppressWarnings("unchecked") final Map<String, String> pathVariables =
                    ((Map<String, String>)request.getAttribute(HandlerMapping.URI_TEMPLATE_VARIABLES_ATTRIBUTE));
            final String currentId = pathVariables.get("usrId");
            if (currentId != null && value.equals(usuarioService.get(Integer.parseInt(currentId)).getUsrCtMilitar())) {
                // value hasn't changed
                return true;
            }
            return !usuarioService.usrCtMilitarExists(value);
        }

    }

}
