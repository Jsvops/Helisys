package io.bootify.helisys.model;

import static java.lang.annotation.ElementType.ANNOTATION_TYPE;
import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.ElementType.METHOD;

import io.bootify.helisys.service.AeronaveService;
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
 * Validate that the anvMatricula value isn't taken yet.
 */
@Target({ FIELD, METHOD, ANNOTATION_TYPE })
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Constraint(
        validatedBy = AeronaveAnvMatriculaUnique.AeronaveAnvMatriculaUniqueValidator.class
)
public @interface AeronaveAnvMatriculaUnique {

    String message() default "{Exists.aeronave.anvMatricula}";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

    class AeronaveAnvMatriculaUniqueValidator implements ConstraintValidator<AeronaveAnvMatriculaUnique, String> {

        private final AeronaveService aeronaveService;
        private final HttpServletRequest request;

        public AeronaveAnvMatriculaUniqueValidator(final AeronaveService aeronaveService,
                final HttpServletRequest request) {
            this.aeronaveService = aeronaveService;
            this.request = request;
        }

        @Override
        public boolean isValid(final String value, final ConstraintValidatorContext cvContext) {
            if (value == null) {
                // no value present
                return true;
            }
            @SuppressWarnings("unchecked") final Map<String, String> pathVariables =
                    ((Map<String, String>)request.getAttribute(HandlerMapping.URI_TEMPLATE_VARIABLES_ATTRIBUTE));
            final String currentId = pathVariables.get("anvId");
            if (currentId != null && value.equalsIgnoreCase(aeronaveService.get(Integer.parseInt(currentId)).getAnvMatricula())) {
                // value hasn't changed
                return true;
            }
            return !aeronaveService.anvMatriculaExists(value);
        }

    }

}
